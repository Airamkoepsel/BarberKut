package com.barberkut.backend.service;

import com.barberkut.backend.dto.AvailabilityResponse;
import com.barberkut.backend.entity.Appointment;
import com.barberkut.backend.entity.Barber;
import com.barberkut.backend.entity.ShopHour;
import com.barberkut.backend.exception.ShopNotFoundException;
import com.barberkut.backend.repository.AppointmentRepository;
import com.barberkut.backend.repository.BarberRepository;
import com.barberkut.backend.repository.ShopHourRepository;
import com.barberkut.backend.repository.ShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Calcula disponibilidade de horários por barbeiro numa data, cruzando o
 * expediente do dia (shop_hours) com os agendamentos ativos (appointments).
 * Granularidade fixa de 30min, igual aos horários estáticos que já existiam
 * em booking.html.
 */
@Service
@Transactional(readOnly = true)
public class AvailabilityService {

    private static final String STATUS_CANCELLED = "cancelled";
    private static final Duration SLOT_STEP = Duration.ofMinutes(30);
    private static final String[] WEEKDAY_BY_ISO_VALUE =
            {null, "seg", "ter", "qua", "qui", "sex", "sab", "dom"};

    private final ShopRepository shopRepository;
    private final ShopHourRepository shopHourRepository;
    private final BarberRepository barberRepository;
    private final AppointmentRepository appointmentRepository;

    public AvailabilityService(ShopRepository shopRepository,
                                ShopHourRepository shopHourRepository,
                                BarberRepository barberRepository,
                                AppointmentRepository appointmentRepository) {
        this.shopRepository = shopRepository;
        this.shopHourRepository = shopHourRepository;
        this.barberRepository = barberRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public AvailabilityResponse availability(String shopId, LocalDate date) {
        if (!shopRepository.existsById(shopId)) {
            throw new ShopNotFoundException(shopId);
        }

        String weekday = WEEKDAY_BY_ISO_VALUE[date.getDayOfWeek().getValue()];
        List<Barber> barbers = barberRepository.findByShop_IdOrderBySortOrderAsc(shopId);
        Optional<ShopHour> shopHour = shopHourRepository.findByShop_IdAndWeekday(shopId, weekday);

        boolean closed = shopHour.isEmpty()
                || shopHour.get().getOpenTime() == null
                || shopHour.get().getCloseTime() == null;

        if (closed) {
            List<AvailabilityResponse.BarberAvailability> barberAvailabilities = barbers.stream()
                    .map(barber -> new AvailabilityResponse.BarberAvailability(barber.getId(), barber.getName(), List.of()))
                    .toList();
            return new AvailabilityResponse(shopId, date, weekday, true, barberAvailabilities);
        }

        LocalTime open = LocalTime.parse(shopHour.get().getOpenTime());
        LocalTime close = LocalTime.parse(shopHour.get().getCloseTime());

        List<LocalTime> allSlots = new ArrayList<>();
        for (LocalTime slot = open; slot.isBefore(close); slot = slot.plus(SLOT_STEP)) {
            allSlots.add(slot);
        }

        List<Appointment> booked = appointmentRepository
                .findByShop_IdAndAppointmentDateAndStatusNot(shopId, date, STATUS_CANCELLED);

        Map<String, Set<LocalTime>> takenByBarber = booked.stream()
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getBarber().toLowerCase(),
                        Collectors.mapping(Appointment::getAppointmentTime, Collectors.toSet())));

        List<AvailabilityResponse.BarberAvailability> barberAvailabilities = barbers.stream()
                .map(barber -> {
                    Set<LocalTime> taken = takenByBarber.getOrDefault(barber.getName().toLowerCase(), Set.of());
                    List<AvailabilityResponse.Slot> slots = allSlots.stream()
                            .map(time -> new AvailabilityResponse.Slot(time, !taken.contains(time)))
                            .toList();
                    return new AvailabilityResponse.BarberAvailability(barber.getId(), barber.getName(), slots);
                })
                .toList();

        return new AvailabilityResponse(shopId, date, weekday, false, barberAvailabilities);
    }
}
