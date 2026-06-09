package com.healthcare.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthcare.dto.request.BookAppointmentRequestDto;
import com.healthcare.dto.request.UpdatePatientProfileDto;
import com.healthcare.dto.response.ApiResponse;
import com.healthcare.dto.response.AppointmentResponseDto;
import com.healthcare.dto.response.DoctorResponseDto;
import com.healthcare.dto.response.PatientProfileResponseDto;
import com.healthcare.dto.response.PatientTestResponseDto;
import com.healthcare.entities.Appointment;
import com.healthcare.entities.Doctor;
import com.healthcare.entities.Patient;
import com.healthcare.entities.Status;
import com.healthcare.entities.User;
import com.healthcare.exception.DuplicateResourceException;
import com.healthcare.exception.ResourceNotFoundException;
import com.healthcare.exception.UnauthorizedException;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.repository.PatientRepository;
import com.healthcare.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientServiceImpl implements PatientService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public PatientProfileResponseDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Patient patient = patientRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + user.getId()));

        PatientProfileResponseDto dto = modelMapper.map(patient, PatientProfileResponseDto.class);
        dto.setId(patient.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setDob(user.getDob());
        dto.setRegAmount(user.getRegAmount());
        
        return dto;
    }

    @Override
    public ApiResponse updateProfile(String email, UpdatePatientProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Patient patient = patientRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + user.getId()));

        // Update User table fields
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setDob(dto.getDob());
        userRepository.save(user);

        // Update Patient table fields
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setGender(dto.getGender());
        patient.setFamilyHistory(dto.getFamilyHistory());
        patientRepository.save(patient);

        return new ApiResponse(true, "Patient profile updated successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponseDto> getAllDoctors(String speciality) {
        List<Doctor> doctors;
        if (speciality != null && !speciality.trim().isEmpty()) {
            doctors = doctorRepository.findBySpeciality(speciality);
        } else {
            doctors = doctorRepository.findAll();
        }

        return doctors.stream()
                .map(doc -> {
                    DoctorResponseDto dto = modelMapper.map(doc, DoctorResponseDto.class);
                    dto.setFirstName(doc.getUserDetails().getFirstName());
                    dto.setLastName(doc.getUserDetails().getLastName());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getSpecialities() {
        return doctorRepository.findDistinctSpecialities();
    }

    @Override
    public ApiResponse bookAppointment(String email, BookAppointmentRequestDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Patient patient = patientRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + user.getId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));

        LocalDateTime start = dto.getStartDateTime();
        LocalDateTime end = start.plusMinutes(doctor.getAppointmentTime());

        // Check if doctor has an overlapping active appointment
        boolean isOverlapping = appointmentRepository.existsOverlappingAppointment(
                doctor.getId(), start, end, Status.SCHEDULED);

        if (isOverlapping) {
            throw new DuplicateResourceException("Doctor is already booked in this time slot: " 
                    + start + " to " + end);
        }

        Appointment appointment = new Appointment();
        appointment.setStartDateTime(start);
        appointment.setEndDateTime(end);
        appointment.setStatus(Status.SCHEDULED);
        appointment.setMyDoctor(doctor);
        appointment.setMyPatient(patient);

        appointmentRepository.save(appointment);

        return new ApiResponse(true, "Appointment booked successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto> getAppointments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Patient patient = patientRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + user.getId()));

        List<Appointment> appointments = appointmentRepository.findByMyPatientIdOrderByStartDateTimeDesc(patient.getId());

        return appointments.stream()
                .map(appt -> {
                    AppointmentResponseDto dto = modelMapper.map(appt, AppointmentResponseDto.class);
                    dto.setDoctorId(appt.getMyDoctor().getId());
                    dto.setDoctorFirstName(appt.getMyDoctor().getUserDetails().getFirstName());
                    dto.setDoctorLastName(appt.getMyDoctor().getUserDetails().getLastName());
                    dto.setDoctorSpeciality(appt.getMyDoctor().getSpeciality());
                    
                    Set<AppointmentResponseDto.DiagTestDto> testDtos = appt.getDiagTests().stream()
                            .map(t -> modelMapper.map(t, AppointmentResponseDto.DiagTestDto.class))
                            .collect(Collectors.toSet());
                    dto.setDiagTests(testDtos);
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ApiResponse cancelAppointment(String email, Long appointmentId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Patient patient = patientRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + user.getId()));

        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        // Security check: Verify appointment belongs to logged-in patient
        if (!appt.getMyPatient().getId().equals(patient.getId())) {
            throw new UnauthorizedException("You are not authorized to cancel this appointment");
        }

        if (appt.getStatus() != Status.SCHEDULED) {
            throw new DuplicateResourceException("Only scheduled appointments can be cancelled");
        }

        appt.setStatus(Status.CANCELLED);
        appointmentRepository.save(appt);

        return new ApiResponse(true, "Appointment cancelled successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientTestResponseDto> getPrescribedTests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Patient patient = patientRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + user.getId()));

        List<Appointment> appointments = appointmentRepository.findByMyPatientIdOrderByStartDateTimeDesc(patient.getId());

        // Extract all diagTests from all appointments of the patient
        return appointments.stream()
                .flatMap(appt -> appt.getDiagTests().stream()
                        .map(test -> {
                            PatientTestResponseDto dto = new PatientTestResponseDto();
                            dto.setTestId(test.getId());
                            dto.setTestName(test.getName());
                            dto.setDescription(test.getDescription());
                            dto.setCost(test.getCost());
                            dto.setAppointmentId(appt.getId());
                            dto.setDoctorFirstName(appt.getMyDoctor().getUserDetails().getFirstName());
                            dto.setDoctorLastName(appt.getMyDoctor().getUserDetails().getLastName());
                            dto.setDatePrescribed(appt.getStartDateTime());
                            return dto;
                        })
                )
                .collect(Collectors.toList());
    }
}
