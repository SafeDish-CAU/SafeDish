package com.safedish.backend.rdb.service;

import com.safedish.backend.rdb.entity.Baemin;
import com.safedish.backend.rdb.entity.Coupang;
import com.safedish.backend.rdb.entity.Owner;
import com.safedish.backend.rdb.entity.Store;
import com.safedish.backend.rdb.repository.BaeminRepository;
import com.safedish.backend.rdb.repository.CoupangRepository;
import com.safedish.backend.rdb.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlatformService {
    private final StoreRepository storeRepository;
    private final BaeminRepository baeminRepository;
    private final CoupangRepository coupangRepository;

    public Baemin createBaemin(String token, Long storeId, Long platformSid) throws Exception {
        Optional<Store> storeOpt = storeRepository.findById(storeId);
        if (storeOpt.isEmpty()) {
            throw new Exception("해당 매장을 찾을 수 없습니다.");
        }

        Store store = storeOpt.get();
        Owner owner = store.getOwner();
        if (!owner.getToken().equals(token)) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        try {
            Baemin baemin = new Baemin(platformSid, store);
            baeminRepository.save(baemin);

            return baemin;
        } catch (Exception e) {
            throw new Exception("이미 등록된 매장입니다.");
        }
    }

    public Coupang createCoupang(String token, Long storeId, Long platformSid) throws Exception {
        Optional<Store> storeOpt = storeRepository.findById(storeId);
        if (storeOpt.isEmpty()) {
            throw new Exception("해당 매장을 찾을 수 없습니다.");
        }

        Store store = storeOpt.get();
        Owner owner = store.getOwner();
        if (!owner.getToken().equals(token)) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        try {
            Coupang coupang = new Coupang(platformSid, store);
            coupangRepository.save(coupang);

            return coupang;
        } catch (Exception e) {
            throw new Exception("이미 등록된 매장입니다.");
        }
    }

    public Long findStoreByPlatform(String platformNmae, Long platformSid) {
        if (platformNmae.equals("baemin")) {
            Optional<Baemin> res = baeminRepository.findById(platformSid);
            return res.map(baemin -> baemin.getStore().getId()).orElse(null);
        }
        if (platformNmae.equals("coupang")) {
            Optional<Coupang> res = coupangRepository.findById(platformSid);
            return res.map(coupang -> coupang.getStore().getId()).orElse(null);
        }
        return null;
    }
}
