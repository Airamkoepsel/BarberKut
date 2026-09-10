package com.barberkut.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;
import java.util.Map;

/**
 * Payload de cadastro de barbearia (cadastrar-barbearia.html). Campos que são
 * regra de negócio ou sensíveis (id, slug, rating, verified, is_open,
 * owner_id, etc.) NÃO vêm do cliente — são decididos no backend
 * (ShopRegistrationService), diferente do fluxo antigo via supabase-js onde
 * o próprio frontend montava e inseria esses valores.
 */
public record ShopCreateRequest(
        @NotBlank String name,
        String tagline,
        String icon,
        String phone,
        String instagram,
        String about,
        @NotBlank String street,
        @NotBlank String district,
        String city,
        String state,

        /** weekday ('seg'..'dom') -> [openTime, closeTime], ou null se fechado nesse dia. */
        Map<String, List<String>> hours,

        List<String> amenities,

        @NotEmpty @Valid List<ServiceInput> services
) {

    public record ServiceInput(
            @NotBlank String name,
            @NotNull @Positive Integer price,
            @NotNull @Positive Integer durationMin
    ) {
    }
}
