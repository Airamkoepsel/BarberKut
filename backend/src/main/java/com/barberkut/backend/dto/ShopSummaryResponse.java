package com.barberkut.backend.dto;

import com.barberkut.backend.entity.Shop;

import java.math.BigDecimal;

public record ShopSummaryResponse(
        String id,
        String slug,
        String name,
        String tagline,
        String cover,
        String icon,
        BigDecimal rating,
        Integer reviewsCount,
        Integer priceFrom,
        boolean open,
        String opensAt,
        boolean verified,
        String district,
        String city,
        BigDecimal distanceKm
) {

    public static ShopSummaryResponse from(Shop shop) {
        return new ShopSummaryResponse(
                shop.getId(),
                shop.getSlug(),
                shop.getName(),
                shop.getTagline(),
                shop.getCover(),
                shop.getIcon(),
                shop.getRating(),
                shop.getReviewsCount(),
                shop.getPriceFrom(),
                shop.isOpen(),
                shop.getOpensAt(),
                shop.isVerified(),
                shop.getDistrict(),
                shop.getCity(),
                shop.getDistanceKm()
        );
    }
}
