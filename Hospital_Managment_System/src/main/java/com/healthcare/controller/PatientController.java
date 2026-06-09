package com.healthcare.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.healthcare.dto.request.BookAppointmentRequestDto;
import com.healthcare.dto.request.UpdatePatientProfileDto;
import com.healthcare.dto.response.ApiResponse;
import com.healthcare.dto.response.AppointmentResponseDto;
import com.healthcare.dto.response.DoctorResponseDto;
import com.healthcare.dto.response.PatientProfileResponseDto;
import com.healthcare.dto.response.PatientTestResponseDto;
import com.healthcare.service.PatientService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/profile")
    public ResponseEntity<PatientProfileResponseDto> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(patientService.getProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdatePatientProfileDto dto) {
        String email = authentication.getName();
        return ResponseEntity.ok(patientService.updateProfile(email, dto));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponseDto>> getAllDoctors(
            @RequestParam(required = false) String speciality) {
        return ResponseEntity.ok(patientService.getAllDoctors(speciality));
    }

    @GetMapping("/specialities")
    public ResponseEntity<List<String>> getSpecialities() {
        return ResponseEntity.ok(patientService.getSpecialities());
    }

    @PostMapping("/appointments")
    public ResponseEntity<ApiResponse> bookAppointment(
            Authentication authentication,
            @Valid @RequestBody BookAppointmentRequestDto dto) {
        String email = authentication.getName();
        return ResponseEntity.ok(patientService.bookAppointment(email, dto));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointments(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(patientService.getAppointments(email));
    }

    @PutMapping("/appointments/{appointmentId}/cancel")
    public ResponseEntity<ApiResponse> cancelAppointment(
            Authentication authentication,
            @PathVariable Long appointmentId) {
        String email = authentication.getName();
        return ResponseEntity.ok(patientService.cancelAppointment(email, appointmentId));
    }

    @GetMapping("/tests")
    public ResponseEntity<List<PatientTestResponseDto>> getPrescribedTests(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(patientService.getPrescribedTests(email));
    }
}
