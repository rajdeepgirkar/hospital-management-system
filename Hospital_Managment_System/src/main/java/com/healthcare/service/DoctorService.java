package com.healthcare.service;

import java.util.List;
import com.healthcare.dto.request.UpdateDoctorProfileDto;
import com.healthcare.dto.response.ApiResponse;
import com.healthcare.dto.response.AppointmentResponseDto;
import com.healthcare.dto.response.DoctorAppointmentResponseDto;
import com.healthcare.dto.response.DoctorProfileResponseDto;
import com.healthcare.entities.Status;

public interface DoctorService {
    DoctorProfileResponseDto getProfile(String email);
    
    ApiResponse updateProfile(String email, UpdateDoctorProfileDto dto);
    
    List<DoctorAppointmentResponseDto> getAppointments(String email);
    
    ApiResponse updateAppointmentStatus(String email, Long appointmentId, Status status);
    
    ApiResponse prescribeTests(String email, Long appointmentId, List<Long> testIds);
    
    List<AppointmentResponseDto.DiagTestDto> getAvailableTests();
}
