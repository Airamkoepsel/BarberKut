package com.barberkut.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record ShopDetailResponse(
        String id,
        String slug,
        String name,
        String tagline,
        String cover,
        String icon,
        BigDecimal rating,
        Integer reviewsCount,
        Integer priceFrom,
        Integer established,
        boolean open,
        String opensAt,
        boolean verified,
        String phone,
        String instagram,
        String about,
        String street,
        String district,
        String city,
        String state,
        BigDecimal lat,
        BigDecimal lng,
        BigDecimal distanceKm,
        Map<String, Integer> ratingBreakdown,
        List<ShopHourResponse> hours,
        List<String> amenities,
        List<ShopServiceResponse> services,
        List<BarberResponse> barbers,
        List<ShopPhotoResponse> photos,
        List<ReviewResponse> reviews
) {
}
