package com.barberkut.backend.service;

import com.barberkut.backend.dto.ShopCreateRequest;
import com.barberkut.backend.entity.Barber;
import com.barberkut.backend.entity.Profile;
import com.barberkut.backend.entity.Shop;
import com.barberkut.backend.entity.ShopAmenity;
import com.barberkut.backend.entity.ShopAmenityId;
import com.barberkut.backend.entity.ShopHour;
import com.barberkut.backend.entity.ShopService;
import com.barberkut.backend.repository.BarberRepository;
import com.barberkut.backend.repository.ProfileRepository;
import com.barberkut.backend.repository.ShopAmenityRepository;
import com.barberkut.backend.repository.ShopHourRepository;
import com.barberkut.backend.repository.ShopRepository;
import com.barberkut.backend.repository.ShopServiceRepository;
import com.barberkut.backend.util.Slugify;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Cadastro de barbearia (cadastrar-barbearia.html, ver P1.8). Ao contrário do
 * fluxo antigo via supabase-js — onde o próprio frontend montava id, slug,
 * rating, verified, is_open e owner_id e inseria isso direto — todos esses
 * campos sensíveis/de negócio são decididos aqui no backend, nunca aceitos
 * do cliente.
 */
@Service
public class ShopRegistrationService {

    private static final List<String> WEEKDAYS = List.of("seg", "ter", "qua", "qui", "sex", "sab", "dom");
    private static final SecureRandom RANDOM = new SecureRandom();

    private final ShopRepository shopRepository;
    private final ShopHourRepository shopHourRepository;
    private final ShopAmenityRepository shopAmenityRepository;
    private final ShopServiceRepository shopServiceRepository;
    private final BarberRepository barberRepository;
    private final ProfileRepository profileRepository;

    public ShopRegistrationService(ShopRepository shopRepository,
                                    ShopHourRepository shopHourRepository,
                                    ShopAmenityRepository shopAmenityRepository,
                                    ShopServiceRepository shopServiceRepository,
                                    BarberRepository barberRepository,
                                    ProfileRepository profileRepository) {
        this.shopRepository = shopRepository;
        this.shopHourRepository = shopHourRepository;
        this.shopAmenityRepository = shopAmenityRepository;
        this.shopServiceRepository = shopServiceRepository;
        this.barberRepository = barberRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public Shop register(ShopCreateRequest request, UUID ownerId) {
        Profile owner = profileRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalStateException("Perfil do usuário autenticado não encontrado: " + ownerId));

        String slug = Slugify.slugify(request.name());
        if (slug.isBlank()) {
            slug = "barbearia";
        }
        String id = uniqueId(slug);

        int priceFrom = request.services().stream()
                .mapToInt(ShopCreateRequest.ServiceInput::price)
                .min()
                .orElseThrow();

        Shop shop = Shop.builder()
                .id(id)
                .slug(slug)
                .name(request.name())
                .tagline(blankToDefault(request.tagline(), "Nova barbearia na BarberKut."))
                .icon(blankToDefault(request.icon(), "✂"))
                .rating(BigDecimal.ZERO)
                .reviewsCount(0)
                .priceFrom(priceFrom)
                .established(Year.now().getValue())
                .open(true)
                .verified(false)
                .phone(request.phone())
                .instagram(request.instagram() == null ? null : request.instagram().replace("@", ""))
                .about(blankToDefault(request.about(), blankToDefault(request.tagline(), "Barbearia recém-cadastrada na BarberKut.")))
                .street(request.street())
                .district(request.district())
                .city(blankToDefault(request.city(), "Timbó"))
                .state(blankToDefault(request.state(), "SC").toUpperCase())
                .owner(owner)
                .build();
        shop = shopRepository.save(shop);

        saveHours(shop, request.hours());
        saveAmenities(shop, request.amenities());
        saveServices(shop, request.services());
        saveDefaultBarber(shop, request.name());

        return shop;
    }

    private void saveHours(Shop shop, java.util.Map<String, List<String>> hours) {
        List<ShopHour> rows = new ArrayList<>();
        for (String weekday : WEEKDAYS) {
            List<String> range = (hours == null) ? null : hours.get(weekday);
            rows.add(ShopHour.builder()
                    .shop(shop)
                    .weekday(weekday)
                    .openTime(range != null && range.size() > 0 ? range.get(0) : null)
                    .closeTime(range != null && range.size() > 1 ? range.get(1) : null)
                    .build());
        }
        shopHourRepository.saveAll(rows);
    }

    private void saveAmenities(Shop shop, List<String> amenities) {
        if (amenities == null || amenities.isEmpty()) {
            return;
        }
        List<ShopAmenity> rows = amenities.stream()
                .map(amenity -> ShopAmenity.builder()
                        .id(new ShopAmenityId(shop.getId(), amenity))
                        .shop(shop)
                        .build())
                .toList();
        shopAmenityRepository.saveAll(rows);
    }

    private void saveServices(Shop shop, List<ShopCreateRequest.ServiceInput> services) {
        List<ShopService> rows = new ArrayList<>();
        int order = 1;
        for (ShopCreateRequest.ServiceInput input : services) {
            rows.add(ShopService.builder()
                    .shop(shop)
                    .name(input.name())
                    .price(input.price())
                    .durationMin(input.durationMin())
                    .sortOrder(order++)
                    .build());
        }
        shopServiceRepository.saveAll(rows);
    }

    private void saveDefaultBarber(Shop shop, String shopName) {
        Barber defaultBarber = Barber.builder()
                .shop(shop)
                .name("Responsável")
                .role("Proprietário")
                .initials(initialsOf(shopName))
                .rating(BigDecimal.valueOf(5.0))
                .specialty("Atendimento geral")
                .sortOrder(1)
                .build();
        barberRepository.save(defaultBarber);
    }

    private String uniqueId(String slug) {
        String candidate;
        do {
            candidate = slug + "-" + randomSuffix();
        } while (shopRepository.existsById(candidate));
        return candidate;
    }

    private static String randomSuffix() {
        return Long.toString(Math.abs(RANDOM.nextLong()), 36).substring(0, 4);
    }

    private static String blankToDefault(String value, String fallback) {
        return (value == null || value.isBlank()) ? fallback : value;
    }

    private static String initialsOf(String name) {
        if (name == null || name.isBlank()) {
            return "?";
        }
        String[] words = name.trim().split("\\s+");
        StringBuilder initials = new StringBuilder();
        for (int i = 0; i < Math.min(2, words.length); i++) {
            if (!words[i].isEmpty()) {
                initials.append(Character.toUpperCase(words[i].charAt(0)));
            }
        }
        return initials.isEmpty() ? "?" : initials.toString();
    }
}
