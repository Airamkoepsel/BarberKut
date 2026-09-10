package com.barberkut.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record FavoriteRequest(@NotBlank String shopId) {
}
