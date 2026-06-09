package com.healthcare.dto.response;

import java.time.LocalDate;

import com.healthcare.entities.BloodGroup;
import com.healthcare.entities.Gender;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientProfileResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDate dob;
    private Integer regAmount;
    private LocalDate createdOn;
    private BloodGroup bloodGroup;
    private Gender gender;
    private String familyHistory;
}
