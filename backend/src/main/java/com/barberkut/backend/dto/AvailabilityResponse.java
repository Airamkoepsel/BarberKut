package com.barberkut.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record AvailabilityResponse(
        String shopId,
        LocalDate date,
        String weekday,
        boolean closed,
        List<BarberAvailability> barbers
) {

    public record BarberAvailability(Long barberId, String barberName, List<Slot> slots) {
    }

    public record Slot(LocalTime time, boolean available) {
    }
}
