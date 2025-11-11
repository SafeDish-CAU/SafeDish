package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.StoreResponseDto;
import com.safedish.backend.rdb.entitiy.Store;
import com.safedish.backend.rdb.repository.StoreRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreController {
    private final StoreRepository storeRepository;

    @GetMapping({"/{storeId}", "/{storeId}/"})
    public ResponseEntity<?> getStore(@PathVariable(name = "storeId") Long storeId) {
        Optional<Store> res = storeRepository.findById(storeId);
        if (res.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 매장이 없습니다");

        Store store = res.get();
        StoreResponseDto dto = new StoreResponseDto(store);
        return ResponseEntity.ok().body(dto);
    }
}
