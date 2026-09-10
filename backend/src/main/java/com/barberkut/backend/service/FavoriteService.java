package com.barberkut.backend.service;

import com.barberkut.backend.entity.Favorite;
import com.barberkut.backend.entity.FavoriteId;
import com.barberkut.backend.entity.Profile;
import com.barberkut.backend.entity.Shop;
import com.barberkut.backend.exception.ShopNotFoundException;
import com.barberkut.backend.repository.FavoriteRepository;
import com.barberkut.backend.repository.ProfileRepository;
import com.barberkut.backend.repository.ShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ShopRepository shopRepository;
    private final ProfileRepository profileRepository;

    public FavoriteService(FavoriteRepository favoriteRepository,
                            ShopRepository shopRepository,
                            ProfileRepository profileRepository) {
        this.favoriteRepository = favoriteRepository;
        this.shopRepository = shopRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public List<Shop> listFavoriteShops(UUID userId) {
        return favoriteRepository.findById_UserId(userId).stream()
                .map(Favorite::getShop)
                .toList();
    }

    @Transactional
    public void addFavorite(UUID userId, String shopId) {
        FavoriteId id = new FavoriteId(userId, shopId);
        if (favoriteRepository.existsById(id)) {
            return;
        }
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ShopNotFoundException(shopId));
        Profile user = profileRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Perfil do usuário autenticado não encontrado: " + userId));

        Favorite favorite = Favorite.builder()
                .id(id)
                .user(user)
                .shop(shop)
                .build();
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(UUID userId, String shopId) {
        favoriteRepository.deleteById(new FavoriteId(userId, shopId));
    }
}
