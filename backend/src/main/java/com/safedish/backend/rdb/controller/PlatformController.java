package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.PlatformResponseDto;
import com.safedish.backend.rdb.service.PlatformService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/platform")
public class PlatformController {
    private final PlatformService platformService;

    @GetMapping({"", "/"})
    public ResponseEntity<?> getPlatform(@RequestParam("pfName") String pfName, @RequestParam("pfSid") Long pfSid) {
        Long storeId = platformService.findStoreByPlatform(pfName, pfSid);
        if (storeId == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당하는 매장이 없습니다");
        PlatformResponseDto dto = new PlatformResponseDto(storeId);
        return ResponseEntity.ok().body(dto);
    }
}
