package com.healthcare.dto.request;

import com.healthcare.entities.BloodGroup;
import com.healthcare.entities.Gender;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientRegisterDto extends UserRegisterDto {

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @Size(max = 300,
            message = "Family history cannot exceed 300 characters")
    private String familyHistory;
}