package com.barberkut.backend.web;

import com.barberkut.backend.dto.AdminAppointmentResponse;
import com.barberkut.backend.dto.AppointmentCreateRequest;
import com.barberkut.backend.dto.AppointmentResponse;
import com.barberkut.backend.dto.AppointmentStatusUpdateRequest;
import com.barberkut.backend.entity.Appointment;
import com.barberkut.backend.entity.Profile;
import com.barberkut.backend.entity.Shop;
import com.barberkut.backend.exception.ShopNotFoundException;
import com.barberkut.backend.repository.ProfileRepository;
import com.barberkut.backend.repository.ShopRepository;
import com.barberkut.backend.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final ShopRepository shopRepository;
    private final ProfileRepository profileRepository;

    public AppointmentController(AppointmentService appointmentService,
                                  ShopRepository shopRepository,
                                  ProfileRepository profileRepository) {
        this.appointmentService = appointmentService;
        this.shopRepository = shopRepository;
        this.profileRepository = profileRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse create(@Valid @RequestBody AppointmentCreateRequest request,
                                       @AuthenticationPrincipal Jwt jwt) {
        Shop shop = shopRepository.findById(request.shopId())
                .orElseThrow(() -> new ShopNotFoundException(request.shopId()));

        UUID userId = UUID.fromString(jwt.getSubject());
        Profile user = profileRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Perfil do usuário autenticado não encontrado: " + userId));

        Appointment appointment = Appointment.builder()
                .shop(shop)
                .shopName(shop.getName())
                .user(user)
                .service(request.service())
                .price(request.price())
                .barber(request.barber())
                .appointmentDate(request.appointmentDate())
                .appointmentTime(request.appointmentTime())
                .build();

        Appointment saved = appointmentService.schedule(appointment);
        return AppointmentResponse.from(saved);
    }

    @GetMapping("/me")
    public List<AppointmentResponse> myAppointments(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return appointmentService.findMine(userId).stream()
                .map(AppointmentResponse::from)
                .toList();
    }

    @PatchMapping("/{id}/cancel")
    public AppointmentResponse cancel(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return AppointmentResponse.from(appointmentService.cancel(id, userId));
    }

    /** Agenda do dono de barbearia (painel admin, P2.10). Sem shopId, cobre todas as dele. */
    @GetMapping("/admin")
    public List<AdminAppointmentResponse> agenda(
            @RequestParam(name = "shopId", required = false) String shopId,
            @AuthenticationPrincipal Jwt jwt) {
        UUID ownerId = UUID.fromString(jwt.getSubject());
        return appointmentService.agendaForOwner(ownerId, shopId).stream()
                .map(AdminAppointmentResponse::from)
                .toList();
    }

    @PatchMapping("/{id}/status")
    public AdminAppointmentResponse updateStatus(@PathVariable Long id,
                                                  @Valid @RequestBody AppointmentStatusUpdateRequest request,
                                                  @AuthenticationPrincipal Jwt jwt) {
        UUID ownerId = UUID.fromString(jwt.getSubject());
        return AdminAppointmentResponse.from(appointmentService.updateStatusAsOwner(id, ownerId, request.status()));
    }
}
