package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.CreateMenuRequestDto;
import com.safedish.backend.rdb.dto.CreateMenuResponseDto;
import com.safedish.backend.rdb.dto.ReadMenuResponseDto;
import com.safedish.backend.rdb.entity.Menu;
import com.safedish.backend.rdb.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menu")
public class MenuController {
    private final MenuService menuService;

    @PostMapping({"", "/"})
    public ResponseEntity<?> createMenu(@RequestHeader("Authorization") String token, @RequestBody CreateMenuRequestDto reqDto) {
        try {
            long allergyMask = 0L;
            for (Long allergyId : reqDto.getAllergies()) {
                allergyMask |= (1L << allergyId);
            }
            Menu menu = menuService.createMenu(token, reqDto.getStoreId(), reqDto.getName(), reqDto.getPrice(), allergyMask);
            CreateMenuResponseDto resDto = new CreateMenuResponseDto(menu.getStore().getId(), menu.getId(), menu.getName(), menu.getPrice(), menu.getAllergyMask());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping({"/{menuId}", "/{menuId}/"})
    public ResponseEntity<?> readMenu(@PathVariable(name = "menuId") Long menuId) {
        try {
            Menu menu = menuService.findByMenuId(menuId);
            ReadMenuResponseDto resDto = new ReadMenuResponseDto(menu);
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
