package com.barberkut.backend.service;

import com.barberkut.backend.entity.Appointment;
import com.barberkut.backend.entity.Shop;
import com.barberkut.backend.exception.AppointmentAccessDeniedException;
import com.barberkut.backend.exception.AppointmentConflictException;
import com.barberkut.backend.exception.AppointmentNotFoundException;
import com.barberkut.backend.exception.ShopAccessDeniedException;
import com.barberkut.backend.exception.ShopNotFoundException;
import com.barberkut.backend.repository.AppointmentRepository;
import com.barberkut.backend.repository.ShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    private static final String STATUS_CANCELLED = "cancelled";
    private static final String STATUS_CONFIRMED = "confirmed";

    private final AppointmentRepository appointmentRepository;
    private final ShopRepository shopRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, ShopRepository shopRepository) {
        this.appointmentRepository = appointmentRepository;
        this.shopRepository = shopRepository;
    }

    /**
     * Cria um agendamento, checando antes se o barbeiro já está ocupado
     * naquela barbearia, data e horário. Agendamentos cancelados não contam
     * como conflito.
     *
     * NOTA: esta checagem em si é "verifica-depois-insere" em nível de
     * aplicação — sob concorrência, duas requisições poderiam passar pela
     * checagem antes de qualquer commit. Isso é coberto pelo índice único
     * parcial criado na migration do P1.5 (appointments_no_double_booking),
     * que faz o INSERT concorrente falhar no banco em vez de criar o conflito.
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

    @Transactional(readOnly = true)
    public List<Appointment> findMine(UUID userId) {
        return appointmentRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Appointment cancel(Long appointmentId, UUID userId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));

        if (!appointment.getUser().getId().equals(userId)) {
            throw new AppointmentAccessDeniedException();
        }

        appointment.setStatus(STATUS_CANCELLED);
        return appointment;
    }

    /**
     * Agenda de agendamentos confirmados pro dono de barbearia (P2.10).
     * Sem shopId, cobre todas as barbearias do dono; com shopId, essa
     * barbearia precisa pertencer a ele.
     */
    @Transactional(readOnly = true)
    public List<Appointment> agendaForOwner(UUID ownerId, String shopId) {
        if (shopId == null || shopId.isBlank()) {
            return appointmentRepository
                    .findTop50ByShop_Owner_IdAndStatusOrderByAppointmentDateDescAppointmentTimeAsc(ownerId, STATUS_CONFIRMED);
        }

        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ShopNotFoundException(shopId));
        assertOwnedBy(shop, ownerId);

        return appointmentRepository
                .findTop50ByShop_IdAndShop_Owner_IdAndStatusOrderByAppointmentDateDescAppointmentTimeAsc(shopId, ownerId, STATUS_CONFIRMED);
    }

    @Transactional
    public Appointment updateStatusAsOwner(Long appointmentId, UUID ownerId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException(appointmentId));
        assertOwnedBy(appointment.getShop(), ownerId);

        appointment.setStatus(status);
        return appointment;
    }

    private static void assertOwnedBy(Shop shop, UUID ownerId) {
        if (shop.getOwner() == null || !shop.getOwner().getId().equals(ownerId)) {
            throw new ShopAccessDeniedException();
        }
    }
}
