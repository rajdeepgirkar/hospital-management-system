package com.healthcare.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import com.healthcare.entities.BloodGroup;
import com.healthcare.entities.Gender;
import com.healthcare.entities.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAppointmentResponseDto {
    private Long id;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Status status;
    private Long patientId;
    private String patientFirstName;
    private String patientLastName;
    private String patientEmail;
    private String patientPhone;
    private LocalDate patientDob;
    private Gender patientGender;
    private BloodGroup patientBloodGroup;
    private Set<DiagTestDto> diagTests;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DiagTestDto {
        private Long id;
        private String name;
        private String description;
        private int cost;
    }
}
