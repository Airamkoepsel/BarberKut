package com.barberkut.backend.web;

import com.barberkut.backend.dto.ProfileResponse;
import com.barberkut.backend.dto.ProfileUpdateRequest;
import com.barberkut.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ProfileResponse me(@AuthenticationPrincipal Jwt jwt) {
        return ProfileResponse.from(profileService.getById(UUID.fromString(jwt.getSubject())));
    }

    @PatchMapping("/me")
    public ProfileResponse updateMe(@Valid @RequestBody ProfileUpdateRequest request, @AuthenticationPrincipal Jwt jwt) {
        return ProfileResponse.from(profileService.update(UUID.fromString(jwt.getSubject()), request));
    }
}
