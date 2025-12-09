package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.CreateOptionGroupRequestDto;
import com.safedish.backend.rdb.dto.CreateOptionGroupResponseDto;
import com.safedish.backend.rdb.dto.CreateOptionItemRequestDto;
import com.safedish.backend.rdb.dto.CreateOptionItemResponseDto;
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
}
