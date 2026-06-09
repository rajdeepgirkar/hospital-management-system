package com.healthcare.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.healthcare.dto.request.DoctorRegisterDto;
import com.healthcare.dto.request.LoginRequestDto;
import com.healthcare.dto.request.PatientRegisterDto;
import com.healthcare.dto.response.ApiResponse;
import com.healthcare.dto.response.LoginResponseDto;
import com.healthcare.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register/doctor")
	public ResponseEntity<ApiResponse> registerDoctor(@Valid @RequestBody DoctorRegisterDto dto) {

		return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerDoctor(dto));
	}

	@PostMapping("/register/patient")
	public ResponseEntity<ApiResponse> registerPatient(@Valid @RequestBody PatientRegisterDto dto) {

		return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerPatient(dto));
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto dto) {

		return ResponseEntity.ok(authService.login(dto));
	}
}