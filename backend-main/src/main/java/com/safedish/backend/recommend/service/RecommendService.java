package com.safedish.backend.recommend.service;

import com.safedish.backend.recommend.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {
    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${recommend.url}")
    private String baseUrl;

    public List<Long> getRecommends(String userId, Long allergyMask) throws Exception {
        String url = baseUrl + "/recommend";

        GetRecommendsRequestDto requestBody = new GetRecommendsRequestDto(userId, allergyMask);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<GetRecommendsRequestDto> httpEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<GetRecommendsInnerResponseDto> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            httpEntity,
                            GetRecommendsInnerResponseDto.class
                    );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new Exception("추천서버 API 오류: " +
                        response.getStatusCode() + " - " + response.getBody());
            }

            GetRecommendsInnerResponseDto body = response.getBody();
            if (body == null || body.getItems() == null) {
                return Collections.emptyList();
            }

            return body.getItems();
        } catch (Exception e) {
            throw new Exception("추천서버 API 오류");
        }
    }

    public void createUser(String userId, Double latitude, Double longitude) throws Exception {
        CreateUserRequestDto requestBody = new CreateUserRequestDto(userId, latitude, longitude);
        postNoContent("/user",  requestBody);
    }

    public void createStore(Long storeId, Double latitude, Double longitude) throws Exception {
        CreateStoreRequestDto requestBody = new CreateStoreRequestDto(storeId, latitude, longitude);
        postNoContent("/store",  requestBody);
    }

    public void createMenu(Long menuId, Long storeId, Long type, Long allergyMask) throws Exception {
        CreateMenuRequestDto requestBody = new CreateMenuRequestDto(menuId, storeId, type, allergyMask);
        postNoContent("/menu",  requestBody);
    }

    public void createOrder(String userId, Long menuId, Long quantity)  throws Exception {
        CreateOrderRequestDto requestBody = new CreateOrderRequestDto(userId, menuId, quantity);
        postNoContent("/order",  requestBody);
    }

    private void postNoContent(String path, Object body) throws Exception {
        String url = baseUrl + path;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Object> httpEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Void> response =
                    restTemplate.exchange(url, HttpMethod.POST, httpEntity, Void.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new Exception("추천서버 API 오류: " +
                        response.getStatusCode() + " - " + response.getBody());
            }
        } catch (Exception e) {
            throw new Exception("추천서버 API 오류");
        }
    }
}
