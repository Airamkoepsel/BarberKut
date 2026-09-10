package com.barberkut.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AppointmentStatusUpdateRequest(
        @NotBlank @Pattern(regexp = "completed|cancelled", message = "status deve ser 'completed' ou 'cancelled'") String status
) {
}
