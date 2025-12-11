package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.*;
import com.safedish.backend.rdb.entity.OptionGroup;
import com.safedish.backend.rdb.entity.OptionItem;
import com.safedish.backend.rdb.service.OptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/option")
public class OptionController {
    private final OptionService optionService;

    @PostMapping({"", "/"})
    public ResponseEntity<?> createOptionGroup(@RequestHeader("Authorization") String token, @RequestBody CreateOptionGroupRequestDto reqDto) {
        try {
            OptionGroup group = optionService.createOptionGroup(token, reqDto.getMenuId(), reqDto.getName());
            CreateOptionGroupResponseDto resDto = new CreateOptionGroupResponseDto(group.getMenu().getId(), group.getId(), group.getName(), group.getMinSelected(), group.getMaxSelected());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping({"/{groupId}/item", "/{groupId}/item/"})
    public ResponseEntity<?> createOptionItem(@RequestHeader("Authorization") String token, @PathVariable(name = "groupId") Long groupId, @RequestBody CreateOptionItemRequestDto reqDto) {
        try {
            long allergyMask = 0L;
            for (Long allergyId : reqDto.getAllergies()) {
                allergyMask |= (1L << allergyId);
            }
            OptionItem item = optionService.createOptionItem(token, groupId, reqDto.getName(), reqDto.getPrice(), allergyMask);
            CreateOptionItemResponseDto resDto = new CreateOptionItemResponseDto(item.getGroup().getId(), item.getId(), item.getName(), item.getPrice(), item.getAllergyMask());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping({"/{groupId}/delete", "/{groupId}/delete/"})
    public ResponseEntity<?> deleteOptionGroup(@PathVariable(name = "groupId") Long groupId, @RequestHeader("Authorization") String token) {
        try {
            optionService.deleteOptionGroup(token, groupId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping({"/{groupId}/item/{itemId}/delete", "/{groupId}/item/{itemId}/delete/"})
    public ResponseEntity<?> deleteOptionItem(@PathVariable(name = "groupId") Long groupId, @PathVariable(name = "itemId") Long itemId, @RequestHeader("Authorization") String token) {
        try {
            optionService.deleteOptionItem(token, groupId, itemId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping({"/{groupId}/edit", "/{groupId}/edit/"})
    public ResponseEntity<?> editOptionGroup(@PathVariable(name = "groupId") Long groupId, @RequestHeader("Authorization") String token, @RequestBody EditOptionGroupRequestDto reqDto) {
        try {
            OptionGroup group = optionService.editOptionGroup(token, groupId, reqDto.getName(), reqDto.getMinSelected(), reqDto.getMaxSelected());
            EditOptionGroupResponseDto resDto = new EditOptionGroupResponseDto(group.getMenu().getId(), group.getId(), group.getName(), group.getMinSelected(), group.getMaxSelected());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping({"/{groupId}/item/{itemId}/edit", "/{groupId}/item/{itemId}/edit/"})
    public ResponseEntity<?> editOptionItem(@PathVariable(name = "groupId") Long groupId, @PathVariable(name = "itemId") Long itemId, @RequestHeader("Authorization") String token,  @RequestBody EditOptionItemRequestDto reqDto) {
        try {
            long allergyMask = 0L;
            for (Long allergyId : reqDto.getAllergies()) {
                allergyMask |= (1L << allergyId);
            }
            OptionItem item = optionService.editOptionItem(token, groupId, itemId, reqDto.getName(), reqDto.getPrice(), allergyMask);
            EditOptionItemResponseDto resDto = new EditOptionItemResponseDto(item.getGroup().getId(), item.getId(), item.getName(), item.getPrice(), item.getAllergyMask());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
