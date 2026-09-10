package com.barberkut.backend.dto;

import com.barberkut.backend.entity.ShopService;

public record ShopServiceResponse(
        Long id,
        String name,
        String description,
        Integer price,
        Integer durationMin,
        boolean popular,
        Integer sortOrder
) {

    public static ShopServiceResponse from(ShopService service) {
        return new ShopServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getPrice(),
                service.getDurationMin(),
                service.isPopular(),
                service.getSortOrder()
        );
    }
}
