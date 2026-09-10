package com.barberkut.backend.repository;

import com.barberkut.backend.entity.ShopHour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShopHourRepository extends JpaRepository<ShopHour, Long> {

    List<ShopHour> findByShop_Id(String shopId);

    Optional<ShopHour> findByShop_IdAndWeekday(String shopId, String weekday);
}
