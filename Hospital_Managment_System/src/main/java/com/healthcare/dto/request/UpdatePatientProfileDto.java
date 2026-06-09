package com.healthcare.dto.request;

import java.time.LocalDate;

import com.healthcare.entities.BloodGroup;
import com.healthcare.entities.Gender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdatePatientProfileDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotNull(message = "Date of birth is required")
    private LocalDate dob;

    private BloodGroup bloodGroup;

    private Gender gender;

    private String familyHistory;
}
