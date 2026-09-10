package com.barberkut.backend.dto;

import com.barberkut.backend.entity.Profile;

import java.time.Instant;
import java.util.UUID;

public record ProfileResponse(UUID id, String name, String phone, String photoUrl, Instant createdAt) {

    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(profile.getId(), profile.getName(), profile.getPhone(), profile.getPhotoUrl(), profile.getCreatedAt());
    }
}
