package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.CreatePlatformRequestDto;
import com.safedish.backend.rdb.dto.CreatePlatformResponseDto;
import com.safedish.backend.rdb.dto.ReadPlatformResponseDto;
import com.safedish.backend.rdb.dto.ReadPlatformsByStoreIdResponseDto;
import com.safedish.backend.rdb.entity.Baemin;
import com.safedish.backend.rdb.entity.Coupang;
import com.safedish.backend.rdb.entity.Store;
import com.safedish.backend.rdb.service.PlatformService;
import com.safedish.backend.rdb.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/platform")
public class PlatformController {
    private final StoreService storeService;
    private final PlatformService platformService;

    @PostMapping({"", "/"})
    public ResponseEntity<?> createPlatform(@RequestHeader("Authorization") String token, @RequestBody CreatePlatformRequestDto reqDto) {
        Long storeId = reqDto.getStoreId();
        String platformName = reqDto.getPlatformName();
        if (platformName.equals("baemin") || platformName.equals("coupang")) {
            try {
                Long platformSid = null;
                if (platformName.equals("baemin")) {
                    Baemin baemin = platformService.createBaemin(token, reqDto.getStoreId(), reqDto.getPlatformSid());
                    platformSid = baemin.getId();
                } else { // else if (platformName.equals("coupang"))
                    Coupang coupang = platformService.createCoupang(token, reqDto.getStoreId(), reqDto.getPlatformSid());
                    platformSid = coupang.getId();
                }
                CreatePlatformResponseDto resDto = new CreatePlatformResponseDto(storeId, platformName, platformSid);
                return ResponseEntity.ok(resDto);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping({"", "/"})
    public ResponseEntity<?> readPlatform(@RequestParam("pf_name") String platformName, @RequestParam("pf_sid") Long platformSid) {
        Long storeId = platformService.findStoreByPlatform(platformName, platformSid);
        if (storeId == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 매장이 없습니다");
        ReadPlatformResponseDto resDto = new ReadPlatformResponseDto(storeId);
        return ResponseEntity.ok().body(resDto);
    }

    @GetMapping({"/{storeId}", "/{storeId}/"})
    public ResponseEntity<?> readPlatformsByStoreId(@PathVariable Long storeId) {
        try {
            ReadPlatformsByStoreIdResponseDto resDto = new ReadPlatformsByStoreIdResponseDto();

            Store store = storeService.findStoreById(storeId);
            for (Baemin baemin : store.getBaemins()) {
                resDto.addItem(new ReadPlatformsByStoreIdResponseDto.Item("baemin", baemin.getId()));
            }
            for (Coupang coupang : store.getCoupangs()) {
                resDto.addItem(new  ReadPlatformsByStoreIdResponseDto.Item("coupang", coupang.getId()));
            }
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
