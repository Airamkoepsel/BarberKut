package com.barberkut.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record ProfileUpdateRequest(@NotBlank String name, String phone, String photoUrl) {
}
