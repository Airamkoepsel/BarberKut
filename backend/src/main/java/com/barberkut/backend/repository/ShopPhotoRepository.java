package com.barberkut.backend.repository;

import com.barberkut.backend.entity.ShopPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShopPhotoRepository extends JpaRepository<ShopPhoto, Long> {

    List<ShopPhoto> findByShop_IdOrderBySortOrderAsc(String shopId);
}
