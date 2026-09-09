package com.barberkut.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Espelha public.shops. id é um slug textual (ex: "central"), atribuído pela
 * aplicação/seed, não gerado pelo banco.
 */
@Entity
@Table(name = "shops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Shop {

    @Id
    @EqualsAndHashCode.Include
    @Column(name = "id")
    private String id;

    @Column(name = "slug", nullable = false, unique = true)
    private String slug;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "tagline")
    private String tagline;

    @Column(name = "cover")
    private String cover;

    @Column(name = "icon")
    private String icon;

    @Column(name = "rating", precision = 3, scale = 1)
    private BigDecimal rating;

    @Column(name = "reviews_count")
    private Integer reviewsCount;

    @Column(name = "price_from")
    private Integer priceFrom;

    @Column(name = "established")
    private Integer established;

    @Column(name = "is_open")
    private boolean open;

    @Column(name = "opens_at")
    private String opensAt;

    @Column(name = "verified")
    private boolean verified;

    @Column(name = "phone")
    private String phone;

    @Column(name = "instagram")
    private String instagram;

    @Column(name = "about")
    private String about;

    @Column(name = "street")
    private String street;

    @Column(name = "district")
    private String district;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "lat", precision = 10, scale = 7)
    private BigDecimal lat;

    @Column(name = "lng", precision = 10, scale = 7)
    private BigDecimal lng;

    @Column(name = "distance_km", precision = 5, scale = 2)
    private BigDecimal distanceKm;

    // jsonb cru; sem tipagem forte ainda, nenhuma regra de negócio depende disso hoje.
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "rating_breakdown", columnDefinition = "jsonb")
    private String ratingBreakdown;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    @ToString.Exclude
    private Profile owner;

    @Column(name = "created_at")
    private Instant createdAt;
}
