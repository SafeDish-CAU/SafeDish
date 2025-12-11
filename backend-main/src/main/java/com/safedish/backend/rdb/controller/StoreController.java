package com.safedish.backend.rdb.controller;

import com.safedish.backend.common.geo.Location;
import com.safedish.backend.kakao.service.KakaoService;
import com.safedish.backend.rdb.dto.CreateStoreRequestDto;
import com.safedish.backend.rdb.dto.CreateStoreResponseDto;
import com.safedish.backend.rdb.dto.ReadStoreResponseDto;
import com.safedish.backend.rdb.dto.ReadStoresResponseDto;
import com.safedish.backend.rdb.entity.Owner;
import com.safedish.backend.rdb.entity.Store;
import com.safedish.backend.rdb.service.OwnerService;
import com.safedish.backend.rdb.service.StoreService;
import com.safedish.backend.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreController {
    private final OwnerService ownerService;
    private final StoreService storeService;
    private final KakaoService kakaoService;
    private final RecommendService recommendService;

    @PostMapping({"", "/"})
    public ResponseEntity<?> createStore(@RequestHeader("Authorization") String token, @RequestBody CreateStoreRequestDto reqDto) {
        Double latitude = null;
        Double longitude = null;

        try {
            Location location = kakaoService.getLocation(reqDto.getRoadAddress());
            latitude = location.getLatitude();
            longitude = location.getLongitude();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("도로명 주소 오류");
        }

        try {
            Store store = storeService.createStore(token, reqDto.getName(), reqDto.getType(), reqDto.getRoadAddress(), reqDto.getPostalCode(), reqDto.getDetailAddress(), latitude, longitude);

            try {
                recommendService.createStore(store.getId(), store.getLatitude(), store.getLongitude());
            } catch (Exception e) {
                System.out.println("추천서버 Menu 생성 실패");
            }

            CreateStoreResponseDto resDto = new CreateStoreResponseDto(store.getId(), store.getName(), store.getType());
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

    @GetMapping({"", "/"})
    public ResponseEntity<?> readStores(@RequestParam("owner_id") Long ownerId) {
        try {
            ReadStoresResponseDto resDto = new ReadStoresResponseDto();

            Owner owner = ownerService.findOwnerById(ownerId);
            for (Store store : owner.getStores()) {
                resDto.addItem(new ReadStoresResponseDto.Item(store.getId(), store.getName(), store.getRoadAddress(), store.getPostalCode(), store.getDetailAddress()));
            }
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
