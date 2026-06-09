package com.healthcare.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthcare.dto.request.UpdateDoctorProfileDto;
import com.healthcare.dto.response.ApiResponse;
import com.healthcare.dto.response.AppointmentResponseDto;
import com.healthcare.dto.response.DoctorAppointmentResponseDto;
import com.healthcare.dto.response.DoctorProfileResponseDto;
import com.healthcare.entities.Appointment;
import com.healthcare.entities.DiagTest;
import com.healthcare.entities.Doctor;
import com.healthcare.entities.Patient;
import com.healthcare.entities.Status;
import com.healthcare.entities.User;
import com.healthcare.exception.ResourceNotFoundException;
import com.healthcare.exception.UnauthorizedException;
import com.healthcare.repository.AppointmentRepository;
import com.healthcare.repository.DiagTestRepository;
import com.healthcare.repository.DoctorRepository;
import com.healthcare.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorServiceImpl implements DoctorService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final DiagTestRepository diagTestRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public DoctorProfileResponseDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Doctor doctor = doctorRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + user.getId()));

        DoctorProfileResponseDto dto = new DoctorProfileResponseDto();
        dto.setId(doctor.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setDob(user.getDob());
        dto.setQualifications(doctor.getQualifications());
        dto.setSpeciality(doctor.getSpeciality());
        dto.setExperienceInYears(doctor.getExperienceInYears());
        dto.setAppointmentTime(doctor.getAppointmentTime());
        dto.setFees(doctor.getFees());

        return dto;
    }

    @Override
    public ApiResponse updateProfile(String email, UpdateDoctorProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Doctor doctor = doctorRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + user.getId()));

        // Update User table fields
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setPhone(dto.getPhone());
        user.setDob(dto.getDob());
        userRepository.save(user);

        // Update Doctor table fields
        doctor.setQualifications(dto.getQualifications());
        doctor.setSpeciality(dto.getSpeciality());
        doctor.setExperienceInYears(dto.getExperienceInYears());
        doctor.setAppointmentTime(dto.getAppointmentTime());
        doctor.setFees(dto.getFees());
        doctorRepository.save(doctor);

        return new ApiResponse(true, "Doctor profile updated successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorAppointmentResponseDto> getAppointments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Doctor doctor = doctorRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + user.getId()));

        List<Appointment> appointments = appointmentRepository.findByMyDoctorIdOrderByStartDateTimeDesc(doctor.getId());

        return appointments.stream()
                .map(appt -> {
                    DoctorAppointmentResponseDto dto = new DoctorAppointmentResponseDto();
                    dto.setId(appt.getId());
                    dto.setStartDateTime(appt.getStartDateTime());
                    dto.setEndDateTime(appt.getEndDateTime());
                    dto.setStatus(appt.getStatus());

                    Patient patient = appt.getMyPatient();
                    User patientUser = patient.getUserDetails();

                    dto.setPatientId(patient.getId());
                    dto.setPatientFirstName(patientUser.getFirstName());
                    dto.setPatientLastName(patientUser.getLastName());
                    dto.setPatientEmail(patientUser.getEmail());
                    dto.setPatientPhone(patientUser.getPhone());
                    dto.setPatientDob(patientUser.getDob());
                    dto.setPatientGender(patient.getGender());
                    dto.setPatientBloodGroup(patient.getBloodGroup());

                    Set<DoctorAppointmentResponseDto.DiagTestDto> testDtos = appt.getDiagTests().stream()
                            .map(t -> new DoctorAppointmentResponseDto.DiagTestDto(t.getId(), t.getName(), t.getDescription(), t.getCost()))
                            .collect(Collectors.toSet());
                    dto.setDiagTests(testDtos);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ApiResponse updateAppointmentStatus(String email, Long appointmentId, Status status) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Doctor doctor = doctorRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + user.getId()));

        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        // Security check: Verify appointment belongs to logged-in doctor
        if (!appt.getMyDoctor().getId().equals(doctor.getId())) {
            throw new UnauthorizedException("You are not authorized to update this appointment");
        }

        appt.setStatus(status);
        appointmentRepository.save(appt);

        return new ApiResponse(true, "Appointment status updated successfully to: " + status);
    }

    @Override
    public ApiResponse prescribeTests(String email, Long appointmentId, List<Long> testIds) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Doctor doctor = doctorRepository.findByUserDetailsId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user: " + user.getId()));

        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        // Security check: Verify appointment belongs to logged-in doctor
        if (!appt.getMyDoctor().getId().equals(doctor.getId())) {
            throw new UnauthorizedException("You are not authorized to prescribe tests for this appointment");
        }

        List<DiagTest> tests = diagTestRepository.findAllById(testIds);
        appt.setDiagTests(new HashSet<>(tests));
        appointmentRepository.save(appt);

        return new ApiResponse(true, "Tests prescribed successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDto.DiagTestDto> getAvailableTests() {
        List<DiagTest> tests = diagTestRepository.findAll();
        return tests.stream()
                .map(t -> new AppointmentResponseDto.DiagTestDto(t.getId(), t.getName(), t.getDescription(), t.getCost()))
                .collect(Collectors.toList());
    }
}
