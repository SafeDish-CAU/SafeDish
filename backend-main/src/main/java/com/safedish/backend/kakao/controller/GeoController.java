package com.safedish.backend.kakao.controller;

import com.safedish.backend.common.geo.Location;
import com.safedish.backend.kakao.dto.GetLocationResponseDto;
import com.safedish.backend.kakao.service.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/geo")
public class GeoController {
    private final KakaoService kakaoService;

    @GetMapping({"", "/"})
    public ResponseEntity<?> getLocation(@RequestParam("road_address") String roadAddress) {
        try {
            Location location = kakaoService.getLocation(roadAddress);
            GetLocationResponseDto resDto = new GetLocationResponseDto(location.getLatitude(), location.getLongitude());
            return  ResponseEntity.status(HttpStatus.OK).body(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
