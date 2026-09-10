package com.barberkut.backend.dto;

import com.barberkut.backend.entity.Appointment;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentResponse(
        Long id,
        String shopId,
        String shopName,
        String service,
        Integer price,
        String barber,
        LocalDate appointmentDate,
        LocalTime appointmentTime,
        String status,
        Instant createdAt
) {

    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getShop().getId(),
                appointment.getShopName(),
                appointment.getService(),
                appointment.getPrice(),
                appointment.getBarber(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getStatus(),
                appointment.getCreatedAt()
        );
    }
}
