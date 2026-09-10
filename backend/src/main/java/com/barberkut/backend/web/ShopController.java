package com.barberkut.backend.web;

import com.barberkut.backend.dto.AvailabilityResponse;
import com.barberkut.backend.dto.ShopCreateRequest;
import com.barberkut.backend.dto.ShopDetailResponse;
import com.barberkut.backend.dto.ShopSummaryResponse;
import com.barberkut.backend.entity.Shop;
import com.barberkut.backend.service.AvailabilityService;
import com.barberkut.backend.service.ShopQueryService;
import com.barberkut.backend.service.ShopRegistrationService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

    private final ShopQueryService shopQueryService;
    private final AvailabilityService availabilityService;
    private final ShopRegistrationService shopRegistrationService;

    public ShopController(ShopQueryService shopQueryService,
                           AvailabilityService availabilityService,
                           ShopRegistrationService shopRegistrationService) {
        this.shopQueryService = shopQueryService;
        this.availabilityService = availabilityService;
        this.shopRegistrationService = shopRegistrationService;
    }

    @GetMapping
    public List<ShopSummaryResponse> listShops() {
        return shopQueryService.listShops();
    }

    @GetMapping("/{id}")
    public ShopDetailResponse getShop(@PathVariable String id) {
        return shopQueryService.getShopDetail(id);
    }

    /** Barbearias do usuário autenticado (painel admin, P2.10). */
    @GetMapping("/mine")
    public List<ShopSummaryResponse> myShops(@AuthenticationPrincipal Jwt jwt) {
        return shopQueryService.listMine(UUID.fromString(jwt.getSubject()));
    }

    @GetMapping("/{id}/disponibilidade")
    public AvailabilityResponse availability(
            @PathVariable String id,
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return availabilityService.availability(id, data);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ShopDetailResponse createShop(@Valid @RequestBody ShopCreateRequest request,
                                          @AuthenticationPrincipal Jwt jwt) {
        Shop shop = shopRegistrationService.register(request, UUID.fromString(jwt.getSubject()));
        return shopQueryService.getShopDetail(shop.getId());
    }
}
