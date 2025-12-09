package com.safedish.backend.rdb.service;

import com.safedish.backend.rdb.entity.Owner;
import com.safedish.backend.rdb.entity.Store;
import com.safedish.backend.rdb.repository.OwnerRepository;
import com.safedish.backend.rdb.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StoreService {
    private final OwnerRepository ownerRepository;
    private final StoreRepository storeRepository;

    public Store createStore(String token, String name, String roadAddress, String postalCode, String detailAddress, Double latitude, Double longitude) throws Exception {
        Optional<Owner> ownerOpt = ownerRepository.findByToken(token);
        if (ownerOpt.isEmpty()) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        Owner owner = ownerOpt.get();
        Store store = new Store(name, roadAddress, postalCode, detailAddress, latitude, longitude, owner);
        storeRepository.save(store);

        return store;
    }

    public Store findStoreById(Long id) throws Exception {
        Optional<Store> storeOpt = storeRepository.findById(id);
        if (storeOpt.isEmpty()) {
            throw new Exception("해당하는 매장이 없습니다.");
        }

        return storeOpt.get();
    }
}
