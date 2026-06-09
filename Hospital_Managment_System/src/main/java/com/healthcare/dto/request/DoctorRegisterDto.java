package com.healthcare.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorRegisterDto extends UserRegisterDto {

    @NotBlank(message = "Qualification is required")
    private String qualifications;

    @NotBlank(message = "Speciality is required")
    private String speciality;

    @Positive(message = "Experience must be greater than 0")
    private int experienceInYears;

    @Positive(message = "Appointment time must be greater than 0")
    private int appointmentTime;

    @Positive(message = "Fees must be greater than 0")
    private int fees;
}