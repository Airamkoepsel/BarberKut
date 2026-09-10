package com.barberkut.backend.repository;

import com.barberkut.backend.entity.Barber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BarberRepository extends JpaRepository<Barber, Long> {

    List<Barber> findByShop_IdOrderBySortOrderAsc(String shopId);
}
