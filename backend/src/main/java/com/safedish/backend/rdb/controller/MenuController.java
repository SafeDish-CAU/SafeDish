package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.*;
import com.safedish.backend.rdb.entity.Menu;
import com.safedish.backend.rdb.entity.Store;
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
            for (Long allergyId : reqDto.getMenuAllergies()) {
                allergyMask |= (1L << allergyId);
            }
            Menu menu = menuService.createMenu(token, reqDto.getStoreId(), reqDto.getMenuName(), reqDto.getMenuPrice(), allergyMask);
            CreateMenuResponseDto resDto = new CreateMenuResponseDto(reqDto.getStoreId(), menu.getId(), menu.getName(), menu.getPrice());
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

    @PostMapping({"/{menuId}/edit", "/{menuId}/edit/"})
    public ResponseEntity<?> editMenu(@PathVariable(name = "menuId") Long menuId, @RequestHeader("Authorization") String token, @RequestBody EditMenuRequestDto reqDto) {
        try {
            long allergyMask = 0L;
            for (Long allergyId : reqDto.getMenuAllergies()) {
                allergyMask |= (1L << allergyId);
            }
            Menu menu = menuService.editMenu(token, menuId, reqDto.getMenuName(), reqDto.getMenuPrice(), allergyMask);
            EditMenuResponseDto resDto = new EditMenuResponseDto(menu.getId(), menu.getName(), menu.getPrice());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping({"/{menuId}/delete", "/{menuId}/delete/"})
    public ResponseEntity<?> deleteMenu(@PathVariable(name = "menuId") Long menuId, @RequestHeader("Authorization") String token) {
        try {
            menuService.deleteMenu(token, menuId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
