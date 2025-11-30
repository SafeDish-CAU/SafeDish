package com.safedish.backend.rdb.service;

import com.safedish.backend.rdb.dto.SearchAddressResponseDto;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Service
@RequiredArgsConstructor
public class KakaoService {
    @Value("${token.kakao-rest-api-key}")
    private String kakaoRestApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Getter
    public static class LatLng {
        private final Double latitude;
        private final Double longitude;

        public LatLng(Double latitude, Double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }
    }

    public LatLng getLatLng(String roadAddress) throws Exception {
        URI uri = UriComponentsBuilder
                .fromUriString("https://dapi.kakao.com")
                .path("/v2/local/search/address.JSON")
                .queryParam("query", roadAddress)
                .build()
                .encode()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoRestApiKey);

        HttpEntity<Void> httpEntity = new HttpEntity<>(headers);

        ResponseEntity<SearchAddressResponseDto> response =
                restTemplate.exchange(uri, HttpMethod.GET, httpEntity, SearchAddressResponseDto.class);

        SearchAddressResponseDto body = response.getBody();
        if (body == null || body.getDocuments() == null || body.getDocuments().isEmpty()) {
            throw new Exception("Kakao API 응답이 올바르지 않습니다.");
        }

        SearchAddressResponseDto.Document document = body.getDocuments().get(0);
        return new LatLng(document.getLatitude(), document.getLongitude());
    }
}
