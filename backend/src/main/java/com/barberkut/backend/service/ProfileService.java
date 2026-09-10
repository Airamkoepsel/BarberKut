package com.barberkut.backend.service;

import com.barberkut.backend.dto.ProfileUpdateRequest;
import com.barberkut.backend.entity.Profile;
import com.barberkut.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public Profile getById(UUID id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Perfil do usuário autenticado não encontrado: " + id));
    }

    @Transactional
    public Profile update(UUID id, ProfileUpdateRequest request) {
        Profile profile = getById(id);
        profile.setName(request.name());
        profile.setPhone(request.phone());
        profile.setPhotoUrl(request.photoUrl());
        return profile;
    }
}
