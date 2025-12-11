package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.*;
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
                } else if (platformName.equals("coupang")) {
                    Coupang coupang = platformService.createCoupang(token, reqDto.getStoreId(), reqDto.getPlatformSid());
                    platformSid = coupang.getId();
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
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

    @PostMapping({"/delete", "/delete/"})
    public ResponseEntity<?> deletePlatform(@RequestHeader("Authorization") String token, @RequestBody DeletePlatformRequestDto reqDto) {
        try {
            if (reqDto.getPfName().equals("baemin")) {
                platformService.deleteBaemin(token, reqDto.getPfSid());
            } else if (reqDto.getPfName().equals("coupang")) {
                platformService.deleteCoupang(token, reqDto.getPfSid());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
