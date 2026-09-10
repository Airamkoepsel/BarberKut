package com.barberkut.backend.repository;

import com.barberkut.backend.entity.ShopAmenity;
import com.barberkut.backend.entity.ShopAmenityId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopAmenityRepository extends JpaRepository<ShopAmenity, ShopAmenityId> {

    List<ShopAmenity> findByShop_Id(String shopId);
}
