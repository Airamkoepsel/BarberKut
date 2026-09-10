package com.barberkut.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentCreateRequest(
        @NotBlank String shopId,
        @NotBlank String service,
        @NotNull @Positive Integer price,
        @NotBlank String barber,
        @NotNull LocalDate appointmentDate,
        @NotNull LocalTime appointmentTime
) {
}
