package com.barberkut.backend.dto;

import com.barberkut.backend.entity.ShopHour;

public record ShopHourResponse(String weekday, String openTime, String closeTime) {

    public static ShopHourResponse from(ShopHour hour) {
        return new ShopHourResponse(hour.getWeekday(), hour.getOpenTime(), hour.getCloseTime());
    }
}
