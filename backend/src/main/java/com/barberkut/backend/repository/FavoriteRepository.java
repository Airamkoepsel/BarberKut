package com.barberkut.backend.repository;

import com.barberkut.backend.entity.Favorite;
import com.barberkut.backend.entity.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {

    List<Favorite> findById_UserId(UUID userId);
}
