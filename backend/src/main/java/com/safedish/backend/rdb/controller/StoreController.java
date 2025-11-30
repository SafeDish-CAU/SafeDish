package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.*;
import com.safedish.backend.rdb.entity.Owner;
import com.safedish.backend.rdb.entity.Store;
import com.safedish.backend.rdb.service.KakaoService;
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
    private final KakaoService kakaoService;

    @PostMapping({"", "/"})
    public ResponseEntity<?> createStore(@RequestHeader("Authorization") String token, @RequestBody CreateStoreRequestDto reqDto) {
        Double latitude = null;
        Double longitude = null;
        
        try {
            KakaoService.LatLng latlng = kakaoService.getLatLng(reqDto.getStoreRoadAddress());
            latitude = latlng.getLatitude();
            longitude = latlng.getLongitude();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("도로명 주소 오류");
        }
        
        try {
            Store store = storeService.createStore(token, reqDto.getStoreName(), reqDto.getStoreRoadAddress(), reqDto.getStorePostalCode(), reqDto.getStoreDetailAddress(), latitude, longitude);
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

     @PostMapping({"/{storeId}/edit", "/{storeId}/edit/"})
     public ResponseEntity<?> editStore(@PathVariable(name = "storeId") Long storeId, @RequestHeader("Authorization") String token, @RequestBody EditStoreRequestDto reqDto) {
         try {
             Store store = storeService.editStore(token, storeId, reqDto.getStoreName());
             EditStoreResponseDto resDto = new EditStoreResponseDto(store.getId(), store.getName());
             return ResponseEntity.ok(resDto);
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
         }
     }

    @PostMapping({"/{storeId}/delete", "/{storeId}/delete/"})
    public ResponseEntity<?> deleteStore(@PathVariable(name = "storeId") Long storeId, @RequestHeader("Authorization") String token) {
        try {
            storeService.deleteStore(token, storeId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping({"/{storeId}/address", "/{storeId}/address/"})
    public ResponseEntity<?> editStoreAddress(@PathVariable(name = "storeId") Long storeId, @RequestHeader("Authorization") String token, @RequestBody EditStoreAddressRequestDto reqDto) {
        Double latitude = null;
        Double longitude = null;

        try {
            KakaoService.LatLng latlng = kakaoService.getLatLng(reqDto.getRoadAddress());
            latitude = latlng.getLatitude();
            longitude = latlng.getLongitude();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("도로명 주소 오류");
        }

        try {
            Store store = storeService.editStoreAddress(token, storeId, reqDto.getRoadAddress(), reqDto.getPostalCode(), reqDto.getDetailAddress(), latitude, longitude);
            EditStoreAddressResponseDto resDto = new EditStoreAddressResponseDto(store.getId(), store.getRoadAddress(), store.getPostalCode(), store.getDetailAddress());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
