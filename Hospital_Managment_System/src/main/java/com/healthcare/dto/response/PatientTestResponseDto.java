package com.healthcare.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientTestResponseDto {
    private Long testId;
    private String testName;
    private String description;
    private int cost;
    private Long appointmentId;
    private String doctorFirstName;
    private String doctorLastName;
    private LocalDateTime datePrescribed;
}
