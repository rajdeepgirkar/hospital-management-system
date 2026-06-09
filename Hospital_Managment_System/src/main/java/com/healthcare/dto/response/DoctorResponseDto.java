package com.healthcare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String speciality;
    private String qualifications;
    private int experienceInYears;
    private int appointmentTime;
    private int fees;
}
