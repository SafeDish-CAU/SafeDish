package com.safedish.backend.recommend.controller;

import com.safedish.backend.rdb.entity.Menu;
import com.safedish.backend.rdb.service.MenuService;
import com.safedish.backend.recommend.dto.CreateOrderRequestDto;
import com.safedish.backend.recommend.dto.CreateUserRequestDto;
import com.safedish.backend.recommend.dto.GetRecommendsResponseDto;
import com.safedish.backend.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommend")
public class RecommendController {
    private final RecommendService recommendService;
    private final MenuService menuService;

    @GetMapping({"", "/"})
    public ResponseEntity<?> getRecommends(@RequestParam("user_id") String userId, @RequestParam("allergy_mask") Long allergyMask) {
        try {
            List<Long> items = recommendService.getRecommends(userId, allergyMask);
            GetRecommendsResponseDto resDto = new GetRecommendsResponseDto();
            for (Long itemId : items) {
                Menu menu = menuService.findByMenuId(itemId);
                Long storeId = menu.getStore().getId();
                String storeName = menu.getStore().getName();
                Long menuId = menu.getId();
                String menuName = menu.getName();
                resDto.addItem(new GetRecommendsResponseDto.Item(storeId, storeName, menuId, menuName));
            }
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping({"/order", "/order/"})
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequestDto reqDto) {
        try {
            recommendService.createOrder(reqDto.getUserId(), reqDto.getMenuId(), reqDto.getQuantity());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping({"/user", "/user/"})
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequestDto reqDto) {
        try {
            recommendService.createUser(reqDto.getId(), reqDto.getLatitude(), reqDto.getLongitude());
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
