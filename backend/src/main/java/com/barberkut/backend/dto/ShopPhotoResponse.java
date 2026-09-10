package com.barberkut.backend.dto;

import com.barberkut.backend.entity.ShopPhoto;

public record ShopPhotoResponse(Long id, String grad, String icon, String url, Integer sortOrder) {

    public static ShopPhotoResponse from(ShopPhoto photo) {
        return new ShopPhotoResponse(photo.getId(), photo.getGrad(), photo.getIcon(), photo.getUrl(), photo.getSortOrder());
    }
}
