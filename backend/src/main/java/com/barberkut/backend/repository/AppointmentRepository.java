package com.barberkut.backend.repository;

import com.barberkut.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUser_IdOrderByCreatedAtDesc(UUID userId);

    /**
     * true se já existir um agendamento (não cancelado) para o mesmo
     * barbeiro, na mesma barbearia, data e horário.
     */
    boolean existsByShop_IdAndBarberIgnoreCaseAndAppointmentDateAndAppointmentTimeAndStatusNot(
            String shopId, String barber, LocalDate appointmentDate, LocalTime appointmentTime, String excludedStatus);

    /**
     * Agendamentos ativos (não cancelados) de uma barbearia numa data —
     * base pra calcular disponibilidade (P1.6).
     */
    List<Appointment> findByShop_IdAndAppointmentDateAndStatusNot(
            String shopId, LocalDate appointmentDate, String excludedStatus);

    /** Agenda do dono da barbearia — todas as barbearias que ele possui. */
    List<Appointment> findTop50ByShop_Owner_IdAndStatusOrderByAppointmentDateDescAppointmentTimeAsc(
            UUID ownerId, String status);

    /** Agenda do dono, filtrada numa barbearia específica (que precisa ser dele). */
    List<Appointment> findTop50ByShop_IdAndShop_Owner_IdAndStatusOrderByAppointmentDateDescAppointmentTimeAsc(
            String shopId, UUID ownerId, String status);
}
