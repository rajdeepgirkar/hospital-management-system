package com.healthcare.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookAppointmentRequestDto {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotNull(message = "Appointment start date/time is required")
    @Future(message = "Appointment must be scheduled for a future time")
    private LocalDateTime startDateTime;
}
