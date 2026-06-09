package com.healthcare.service;

import java.util.List;

import com.healthcare.dto.request.BookAppointmentRequestDto;
import com.healthcare.dto.request.UpdatePatientProfileDto;
import com.healthcare.dto.response.ApiResponse;
import com.healthcare.dto.response.AppointmentResponseDto;
import com.healthcare.dto.response.DoctorResponseDto;
import com.healthcare.dto.response.PatientProfileResponseDto;
import com.healthcare.dto.response.PatientTestResponseDto;

public interface PatientService {

    PatientProfileResponseDto getProfile(String email);

    ApiResponse updateProfile(String email, UpdatePatientProfileDto dto);

    List<DoctorResponseDto> getAllDoctors(String speciality);

    List<String> getSpecialities();

    ApiResponse bookAppointment(String email, BookAppointmentRequestDto dto);

    List<AppointmentResponseDto> getAppointments(String email);

    ApiResponse cancelAppointment(String email, Long appointmentId);

    List<PatientTestResponseDto> getPrescribedTests(String email);
}
