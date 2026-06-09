package com.healthcare.dto.request;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class UpdateDoctorProfileDto {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotNull(message = "Date of birth is required")
    private LocalDate dob;

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
