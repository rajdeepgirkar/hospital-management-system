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

import com.healthcare.dto.request.UpdateDoctorProfileDto;
import com.healthcare.dto.response.ApiResponse;
import com.healthcare.dto.response.AppointmentResponseDto;
import com.healthcare.dto.response.DoctorAppointmentResponseDto;
import com.healthcare.dto.response.DoctorProfileResponseDto;
import com.healthcare.entities.Status;
import com.healthcare.service.DoctorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/doctor")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/profile")
    public ResponseEntity<DoctorProfileResponseDto> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.getProfile(email));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateDoctorProfileDto dto) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.updateProfile(email, dto));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<DoctorAppointmentResponseDto>> getAppointments(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.getAppointments(email));
    }

    @PutMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<ApiResponse> updateAppointmentStatus(
            Authentication authentication,
            @PathVariable Long appointmentId,
            @RequestParam Status status) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.updateAppointmentStatus(email, appointmentId, status));
    }

    @PostMapping("/appointments/{appointmentId}/tests")
    public ResponseEntity<ApiResponse> prescribeTests(
            Authentication authentication,
            @PathVariable Long appointmentId,
            @RequestBody List<Long> testIds) {
        String email = authentication.getName();
        return ResponseEntity.ok(doctorService.prescribeTests(email, appointmentId, testIds));
    }

    @GetMapping("/tests")
    public ResponseEntity<List<AppointmentResponseDto.DiagTestDto>> getAvailableTests() {
        return ResponseEntity.ok(doctorService.getAvailableTests());
    }
}
