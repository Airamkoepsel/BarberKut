package com.barberkut.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

/**
 * Espelha public.appointments. appointment_date/appointment_time continuam
 * String porque a coluna ainda é text no banco — migrar junto com o P1.5
 * (quando a coluna virar date/time no schema).
 */
@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Appointment {

    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private Profile user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    @ToString.Exclude
    private Shop shop;

    @Column(name = "shop_name")
    private String shopName;

    @Column(name = "service")
    private String service;

    @Column(name = "price")
    private Integer price;

    @Column(name = "barber")
    private String barber;

    @Column(name = "appointment_date")
    private String appointmentDate;

    @Column(name = "appointment_time")
    private String appointmentTime;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private Instant createdAt;
}
