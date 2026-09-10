package com.barberkut.backend.web;

import com.barberkut.backend.dto.FavoriteRequest;
import com.barberkut.backend.dto.ShopSummaryResponse;
import com.barberkut.backend.service.FavoriteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping("/me")
    public List<ShopSummaryResponse> myFavorites(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return favoriteService.listFavoriteShops(userId).stream()
                .map(ShopSummaryResponse::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void add(@Valid @RequestBody FavoriteRequest request, @AuthenticationPrincipal Jwt jwt) {
        favoriteService.addFavorite(UUID.fromString(jwt.getSubject()), request.shopId());
    }

    @DeleteMapping("/{shopId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable String shopId, @AuthenticationPrincipal Jwt jwt) {
        favoriteService.removeFavorite(UUID.fromString(jwt.getSubject()), shopId);
    }
}
