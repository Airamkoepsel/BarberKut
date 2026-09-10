package com.barberkut.backend.repository;

import com.barberkut.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByShop_IdOrderByCreatedAtDesc(String shopId);
}
