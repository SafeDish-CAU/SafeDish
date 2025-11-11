package com.safedish.backend.rdb.service;

import com.safedish.backend.rdb.entitiy.Baemin;
import com.safedish.backend.rdb.entitiy.Coupang;
import com.safedish.backend.rdb.repository.BaeminRepository;
import com.safedish.backend.rdb.repository.CoupangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlatformService {
    private final BaeminRepository baeminRepository;
    private final CoupangRepository coupangRepository;

    public Long findStoreByPlatform(String pfName, Long pfSid) {
        if (pfName.equals("baemin")) {
            Optional<Baemin> res = baeminRepository.findById(pfSid);
            return res.map(baemin -> baemin.getStore().getId()).orElse(null);
        }
        if (pfName.equals("coupang")) {
            Optional<Coupang> res = coupangRepository.findById(pfSid);
            return res.map(coupang -> coupang.getStore().getId()).orElse(null);
        }
        return null;
    }
}
