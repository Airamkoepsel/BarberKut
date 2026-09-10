package com.barberkut.backend.repository;

import com.barberkut.backend.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ShopRepository extends JpaRepository<Shop, String> {

    boolean existsBySlug(String slug);

    List<Shop> findByOwner_Id(UUID ownerId);
}
