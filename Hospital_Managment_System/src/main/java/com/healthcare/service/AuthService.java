package com.healthcare.service;

import com.healthcare.dto.request.DoctorRegisterDto;
import com.healthcare.dto.request.LoginRequestDto;
import com.healthcare.dto.request.PatientRegisterDto;
import com.healthcare.dto.response.ApiResponse;
import com.healthcare.dto.response.LoginResponseDto;

public interface AuthService {

    ApiResponse registerDoctor(DoctorRegisterDto dto);

    ApiResponse registerPatient(PatientRegisterDto dto);

    LoginResponseDto login(LoginRequestDto dto);

}