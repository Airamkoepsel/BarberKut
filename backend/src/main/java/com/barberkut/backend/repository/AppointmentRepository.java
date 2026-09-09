package com.barberkut.backend.repository;

import com.barberkut.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /**
     * true se já existir um agendamento (não cancelado) para o mesmo
     * barbeiro, na mesma barbearia, data e horário.
     */
    boolean existsByShop_IdAndBarberIgnoreCaseAndAppointmentDateAndAppointmentTimeAndStatusNot(
            String shopId, String barber, String appointmentDate, String appointmentTime, String excludedStatus);
}
