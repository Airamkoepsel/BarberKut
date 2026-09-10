package com.barberkut.backend.service;

import com.barberkut.backend.dto.BarberResponse;
import com.barberkut.backend.dto.ReviewResponse;
import com.barberkut.backend.dto.ShopDetailResponse;
import com.barberkut.backend.dto.ShopHourResponse;
import com.barberkut.backend.dto.ShopPhotoResponse;
import com.barberkut.backend.dto.ShopServiceResponse;
import com.barberkut.backend.dto.ShopSummaryResponse;
import com.barberkut.backend.entity.Shop;
import com.barberkut.backend.exception.ShopNotFoundException;
import com.barberkut.backend.repository.BarberRepository;
import com.barberkut.backend.repository.ReviewRepository;
import com.barberkut.backend.repository.ShopAmenityRepository;
import com.barberkut.backend.repository.ShopHourRepository;
import com.barberkut.backend.repository.ShopPhotoRepository;
import com.barberkut.backend.repository.ShopRepository;
import com.barberkut.backend.repository.ShopServiceRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ShopQueryService {

    private final ShopRepository shopRepository;
    private final ShopHourRepository shopHourRepository;
    private final ShopAmenityRepository shopAmenityRepository;
    private final ShopServiceRepository shopServiceRepository;
    private final BarberRepository barberRepository;
    private final ShopPhotoRepository shopPhotoRepository;
    private final ReviewRepository reviewRepository;
    private final ObjectMapper objectMapper;

    public ShopQueryService(ShopRepository shopRepository,
                             ShopHourRepository shopHourRepository,
                             ShopAmenityRepository shopAmenityRepository,
                             ShopServiceRepository shopServiceRepository,
                             BarberRepository barberRepository,
                             ShopPhotoRepository shopPhotoRepository,
                             ReviewRepository reviewRepository,
                             ObjectMapper objectMapper) {
        this.shopRepository = shopRepository;
        this.shopHourRepository = shopHourRepository;
        this.shopAmenityRepository = shopAmenityRepository;
        this.shopServiceRepository = shopServiceRepository;
        this.barberRepository = barberRepository;
        this.shopPhotoRepository = shopPhotoRepository;
        this.reviewRepository = reviewRepository;
        this.objectMapper = objectMapper;
    }

    public List<ShopSummaryResponse> listShops() {
        return shopRepository.findAll().stream()
                .map(ShopSummaryResponse::from)
                .toList();
    }

    /** Barbearias que pertencem ao usuário autenticado (painel admin, P2.10). */
    public List<ShopSummaryResponse> listMine(UUID ownerId) {
        return shopRepository.findByOwner_Id(ownerId).stream()
                .map(ShopSummaryResponse::from)
                .toList();
    }

    public ShopDetailResponse getShopDetail(String shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ShopNotFoundException(shopId));

        List<ShopHourResponse> hours = shopHourRepository.findByShop_Id(shopId).stream()
                .map(ShopHourResponse::from)
                .toList();

        List<String> amenities = shopAmenityRepository.findByShop_Id(shopId).stream()
                .map(amenity -> amenity.getId().getAmenity())
                .toList();

        List<ShopServiceResponse> services = shopServiceRepository.findByShop_IdOrderBySortOrderAsc(shopId).stream()
                .map(ShopServiceResponse::from)
                .toList();

        List<BarberResponse> barbers = barberRepository.findByShop_IdOrderBySortOrderAsc(shopId).stream()
                .map(BarberResponse::from)
                .toList();

        List<ShopPhotoResponse> photos = shopPhotoRepository.findByShop_IdOrderBySortOrderAsc(shopId).stream()
                .map(ShopPhotoResponse::from)
                .toList();

        List<ReviewResponse> reviews = reviewRepository.findByShop_IdOrderByCreatedAtDesc(shopId).stream()
                .map(ReviewResponse::from)
                .toList();

        return new ShopDetailResponse(
                shop.getId(), shop.getSlug(), shop.getName(), shop.getTagline(), shop.getCover(), shop.getIcon(),
                shop.getRating(), shop.getReviewsCount(), shop.getPriceFrom(), shop.getEstablished(), shop.isOpen(),
                shop.getOpensAt(), shop.isVerified(), shop.getPhone(), shop.getInstagram(), shop.getAbout(),
                shop.getStreet(), shop.getDistrict(), shop.getCity(), shop.getState(), shop.getLat(), shop.getLng(),
                shop.getDistanceKm(), parseRatingBreakdown(shop.getRatingBreakdown()), hours, amenities, services, barbers, photos, reviews
        );
    }

    private Map<String, Integer> parseRatingBreakdown(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Integer>>() {
            });
        } catch (Exception e) {
            return Map.of();
        }
    }
}
