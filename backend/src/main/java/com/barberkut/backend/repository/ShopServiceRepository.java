package com.barberkut.backend.repository;

import com.barberkut.backend.entity.ShopService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopServiceRepository extends JpaRepository<ShopService, Long> {

    List<ShopService> findByShop_IdOrderBySortOrderAsc(String shopId);
}
