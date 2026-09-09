package com.barberkut.backend.service;

import com.barberkut.backend.entity.Appointment;
import com.barberkut.backend.exception.AppointmentConflictException;
import com.barberkut.backend.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppointmentService {

    private static final String STATUS_CANCELLED = "cancelled";
    private static final String STATUS_CONFIRMED = "confirmed";

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    /**
     * Cria um agendamento, checando antes se o barbeiro já está ocupado
     * naquela barbearia, data e horário. Agendamentos cancelados não contam
     * como conflito.
     *
     * NOTA: esta checagem é "verifica-depois-insere" em nível de aplicação.
     * Sob duas requisições concorrentes para o mesmo horário, ambas podem
     * passar pela checagem antes de qualquer commit, causando um conflito
     * real no banco. A correção definitiva é um índice único parcial no
     * Postgres (shop_id, barber, appointment_date, appointment_time onde
     * status <> 'cancelled') — a propor junto do P1.5, que já migra essas
     * colunas de text para date/time.
     */
    @Transactional
    public Appointment schedule(Appointment appointment) {
        boolean hasConflict = appointmentRepository
                .existsByShop_IdAndBarberIgnoreCaseAndAppointmentDateAndAppointmentTimeAndStatusNot(
                        appointment.getShop().getId(),
                        appointment.getBarber(),
                        appointment.getAppointmentDate(),
                        appointment.getAppointmentTime(),
                        STATUS_CANCELLED);

        if (hasConflict) {
            throw new AppointmentConflictException(
                    "Já existe um agendamento para %s em %s às %s."
                            .formatted(appointment.getBarber(), appointment.getAppointmentDate(), appointment.getAppointmentTime()));
        }

        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus(STATUS_CONFIRMED);
        }

        return appointmentRepository.save(appointment);
    }
}
