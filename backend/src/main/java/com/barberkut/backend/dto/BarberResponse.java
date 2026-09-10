package com.barberkut.backend.dto;

import com.barberkut.backend.entity.Barber;

import java.math.BigDecimal;

public record BarberResponse(
        Long id,
        String name,
        String role,
        String initials,
        BigDecimal rating,
        String specialty,
        Integer sortOrder
) {

    public static BarberResponse from(Barber barber) {
        return new BarberResponse(
                barber.getId(),
                barber.getName(),
                barber.getRole(),
                barber.getInitials(),
                barber.getRating(),
                barber.getSpecialty(),
                barber.getSortOrder()
        );
    }
}
