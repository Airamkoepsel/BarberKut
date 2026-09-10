package com.barberkut.backend.dto;

import com.barberkut.backend.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;

/** Igual a AppointmentResponse, com o nome do cliente pra visão do dono da barbearia. */
public record AdminAppointmentResponse(
        Long id,
        String shopId,
        String shopName,
        String service,
        Integer price,
        String barber,
        LocalDate appointmentDate,
        LocalTime appointmentTime,
        String status,
        String clientName
) {

    public static AdminAppointmentResponse from(Appointment appointment) {
        return new AdminAppointmentResponse(
                appointment.getId(),
                appointment.getShop().getId(),
                appointment.getShopName(),
                appointment.getService(),
                appointment.getPrice(),
                appointment.getBarber(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getStatus(),
                appointment.getUser() != null ? appointment.getUser().getName() : "Cliente"
        );
    }
}
