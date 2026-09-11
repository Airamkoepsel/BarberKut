package com.barberkut.backend.service;

import com.barberkut.backend.entity.Appointment;
import com.barberkut.backend.entity.Profile;
import com.barberkut.backend.entity.Shop;
import com.barberkut.backend.exception.AppointmentAccessDeniedException;
import com.barberkut.backend.exception.AppointmentConflictException;
import com.barberkut.backend.exception.AppointmentNotFoundException;
import com.barberkut.backend.exception.ShopAccessDeniedException;
import com.barberkut.backend.exception.ShopNotFoundException;
import com.barberkut.backend.repository.AppointmentRepository;
import com.barberkut.backend.repository.ShopRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Cobertura da regra central de negócio do BarberKut: evitar dois
 * agendamentos ativos pro mesmo barbeiro/barbearia/data/hora (P0.4), e da
 * autorização "dono de barbearia" usada pelo painel admin (P2.10).
 */
@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    private static final String SHOP_ID = "central";
    private static final LocalDate DATE = LocalDate.of(2026, 9, 15);
    private static final LocalTime TIME = LocalTime.of(14, 0);

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private ShopRepository shopRepository;

    private AppointmentService service;

    @BeforeEach
    void setUp() {
        service = new AppointmentService(appointmentRepository, shopRepository);
    }

    @Nested
    class Schedule {

        @Test
        void lancaConflitoQuandoJaExisteAgendamentoAtivoNoMesmoBarbeiroDataEHora() {
            when(appointmentRepository.existsByShop_IdAndBarberIgnoreCaseAndAppointmentDateAndAppointmentTimeAndStatusNot(
                    eq(SHOP_ID), eq("João Silva"), eq(DATE), eq(TIME), eq("cancelled")))
                    .thenReturn(true);

            Appointment appointment = appointment("João Silva", null);

            assertThatThrownBy(() -> service.schedule(appointment))
                    .isInstanceOf(AppointmentConflictException.class);

            verify(appointmentRepository, never()).save(any());
        }

        @Test
        void permiteAgendarQuandoNaoHaConflito() {
            when(appointmentRepository.existsByShop_IdAndBarberIgnoreCaseAndAppointmentDateAndAppointmentTimeAndStatusNot(
                    anyString(), anyString(), any(), any(), anyString()))
                    .thenReturn(false);
            when(appointmentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            Appointment appointment = appointment("João Silva", null);

            Appointment saved = service.schedule(appointment);

            assertThat(saved.getStatus()).isEqualTo("confirmed");
            verify(appointmentRepository).save(appointment);
        }

        @Test
        void naoConsideraAgendamentoCanceladoComoConflito() {
            // O repositório já exclui status='cancelled' na própria query (StatusNot);
            // este teste garante que o service passa "cancelled" como status excluído,
            // não outro valor por engano.
            when(appointmentRepository.existsByShop_IdAndBarberIgnoreCaseAndAppointmentDateAndAppointmentTimeAndStatusNot(
                    anyString(), anyString(), any(), any(), eq("cancelled")))
                    .thenReturn(false);
            when(appointmentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            service.schedule(appointment("João Silva", null));

            verify(appointmentRepository).existsByShop_IdAndBarberIgnoreCaseAndAppointmentDateAndAppointmentTimeAndStatusNot(
                    eq(SHOP_ID), eq("João Silva"), eq(DATE), eq(TIME), eq("cancelled"));
        }

        @Test
        void checagemDeConflitoIgnoraCaixaDoNomeDoBarbeiro() {
            // barber é texto livre (ver P0.2) — "joão silva" e "João Silva" devem
            // ser tratados como o mesmo barbeiro na checagem de conflito.
            Appointment appointment = appointment("joão silva", null);

            when(appointmentRepository.existsByShop_IdAndBarberIgnoreCaseAndAppointmentDateAndAppointmentTimeAndStatusNot(
                    eq(SHOP_ID), eq("joão silva"), eq(DATE), eq(TIME), eq("cancelled")))
                    .thenReturn(true);

            assertThatThrownBy(() -> service.schedule(appointment))
                    .isInstanceOf(AppointmentConflictException.class);
        }

        @Test
        void naoSobrescreveStatusJaDefinidoExplicitamente() {
            when(appointmentRepository.existsByShop_IdAndBarberIgnoreCaseAndAppointmentDateAndAppointmentTimeAndStatusNot(
                    anyString(), anyString(), any(), any(), anyString()))
                    .thenReturn(false);
            when(appointmentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

            Appointment appointment = appointment("João Silva", "completed");

            Appointment saved = service.schedule(appointment);

            assertThat(saved.getStatus()).isEqualTo("completed");
        }
    }

    @Nested
    class Cancel {

        @Test
        void cancelaQuandoAgendamentoPertenceAoUsuario() {
            UUID userId = UUID.randomUUID();
            Appointment appointment = appointment("João Silva", "confirmed");
            appointment.setUser(profile(userId));
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));

            Appointment cancelled = service.cancel(1L, userId);

            assertThat(cancelled.getStatus()).isEqualTo("cancelled");
        }

        @Test
        void rejeitaCancelamentoDeAgendamentoDeOutroUsuario() {
            Appointment appointment = appointment("João Silva", "confirmed");
            appointment.setUser(profile(UUID.randomUUID()));
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));

            assertThatThrownBy(() -> service.cancel(1L, UUID.randomUUID()))
                    .isInstanceOf(AppointmentAccessDeniedException.class);

            assertThat(appointment.getStatus()).isEqualTo("confirmed");
        }

        @Test
        void lancaNotFoundQuandoAgendamentoNaoExiste() {
            when(appointmentRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.cancel(99L, UUID.randomUUID()))
                    .isInstanceOf(AppointmentNotFoundException.class);
        }
    }

    @Nested
    class AgendaDoDono {

        @Test
        void semShopIdBuscaAgendaDeTodasAsBarbeariasDoDono() {
            UUID ownerId = UUID.randomUUID();
            when(appointmentRepository.findTop50ByShop_Owner_IdAndStatusOrderByAppointmentDateDescAppointmentTimeAsc(ownerId, "confirmed"))
                    .thenReturn(List.of(appointment("João Silva", "confirmed")));

            List<Appointment> agenda = service.agendaForOwner(ownerId, null);

            assertThat(agenda).hasSize(1);
        }

        @Test
        void comShopIdDoProprioDonoFiltraPorBarbearia() {
            UUID ownerId = UUID.randomUUID();
            Shop shop = shop(SHOP_ID, ownerId);
            when(shopRepository.findById(SHOP_ID)).thenReturn(Optional.of(shop));
            when(appointmentRepository.findTop50ByShop_IdAndShop_Owner_IdAndStatusOrderByAppointmentDateDescAppointmentTimeAsc(
                    SHOP_ID, ownerId, "confirmed")).thenReturn(List.of());

            service.agendaForOwner(ownerId, SHOP_ID);

            verify(appointmentRepository).findTop50ByShop_IdAndShop_Owner_IdAndStatusOrderByAppointmentDateDescAppointmentTimeAsc(
                    SHOP_ID, ownerId, "confirmed");
        }

        @Test
        void rejeitaShopIdQuePertenceAOutroDono() {
            UUID ownerId = UUID.randomUUID();
            Shop shop = shop(SHOP_ID, UUID.randomUUID()); // dono diferente
            when(shopRepository.findById(SHOP_ID)).thenReturn(Optional.of(shop));

            assertThatThrownBy(() -> service.agendaForOwner(ownerId, SHOP_ID))
                    .isInstanceOf(ShopAccessDeniedException.class);
        }

        @Test
        void lancaNotFoundQuandoShopIdNaoExiste() {
            when(shopRepository.findById("inexistente")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.agendaForOwner(UUID.randomUUID(), "inexistente"))
                    .isInstanceOf(ShopNotFoundException.class);
        }
    }

    @Nested
    class AtualizarStatusComoDono {

        @Test
        void permiteQuandoBarbeariaPertenceAoDono() {
            UUID ownerId = UUID.randomUUID();
            Appointment appointment = appointment("João Silva", "confirmed");
            appointment.setShop(shop(SHOP_ID, ownerId));
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));

            Appointment updated = service.updateStatusAsOwner(1L, ownerId, "completed");

            assertThat(updated.getStatus()).isEqualTo("completed");
        }

        @Test
        void rejeitaQuandoBarbeariaPertenceAOutroDono() {
            Appointment appointment = appointment("João Silva", "confirmed");
            appointment.setShop(shop(SHOP_ID, UUID.randomUUID()));
            when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));

            assertThatThrownBy(() -> service.updateStatusAsOwner(1L, UUID.randomUUID(), "completed"))
                    .isInstanceOf(ShopAccessDeniedException.class);

            assertThat(appointment.getStatus()).isEqualTo("confirmed");
        }
    }

    private static Appointment appointment(String barber, String status) {
        return Appointment.builder()
                .shop(Shop.builder().id(SHOP_ID).build())
                .barber(barber)
                .appointmentDate(DATE)
                .appointmentTime(TIME)
                .status(status)
                .build();
    }

    private static Shop shop(String id, UUID ownerId) {
        return Shop.builder().id(id).owner(profile(ownerId)).build();
    }

    private static Profile profile(UUID id) {
        return Profile.builder().id(id).build();
    }
}
