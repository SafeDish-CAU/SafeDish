package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.CreateStoreRequestDto;
import com.safedish.backend.rdb.dto.CreateStoreResponseDto;
import com.safedish.backend.rdb.dto.ReadStoreResponseDto;
import com.safedish.backend.rdb.entity.Store;
import com.safedish.backend.rdb.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreController {
    private final StoreService storeService;

    @PostMapping({"", "/"})
    public ResponseEntity<?> createStore(@RequestHeader("Authorization") String token, @RequestBody CreateStoreRequestDto reqDto) {
        try {
            Store store = storeService.createStore(token, reqDto.getStoreName());
            CreateStoreResponseDto resDto = new CreateStoreResponseDto(store.getId(), store.getName());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping({"/{storeId}", "/{storeId}/"})
    public ResponseEntity<?> readStore(@PathVariable(name = "storeId") Long storeId) {
        try {
            Store store = storeService.findStoreById(storeId);
            ReadStoreResponseDto resDto = new ReadStoreResponseDto(store);
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
