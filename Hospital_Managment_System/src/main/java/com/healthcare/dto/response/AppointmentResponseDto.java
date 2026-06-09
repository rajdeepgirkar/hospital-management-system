package com.healthcare.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

import com.healthcare.entities.Status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {
    private Long id;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Status status;
    private Long doctorId;
    private String doctorFirstName;
    private String doctorLastName;
    private String doctorSpeciality;
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
