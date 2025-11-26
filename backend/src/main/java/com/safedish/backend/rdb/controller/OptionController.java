package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.*;
import com.safedish.backend.rdb.entity.Option;
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
    public ResponseEntity<?> createOption(@RequestHeader("Authorization") String token, @RequestBody CreateOptionRequestDto reqDto) {
        try {
            long allergyMask = 0L;
            for (Long allergyId : reqDto.getOptionAllergies()) {
                allergyMask |= (1L << allergyId);
            }
            Option option = optionService.createOption(token, reqDto.getMenuId(), reqDto.getOptionName(), reqDto.getOptionPrice(), allergyMask);
            CreateOptionResponseDto resDto = new CreateOptionResponseDto(reqDto.getMenuId(), option.getId(), option.getName(), option.getPrice());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping({"/{optionId}", "/{optionId}/"})
    public ResponseEntity<?> readOption(@PathVariable("optionId") Long optionId) {
        try {
            Option option = optionService.findByOptionId(optionId);
            ReadOptionResponseDto resDto = new ReadOptionResponseDto(option);
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping({"/{optionId}/edit", "/{optionId}/edit/"})
    public ResponseEntity<?> editOption(@PathVariable("optionId") Long optionId, @RequestHeader("Authorization") String token, @RequestBody EditOptionRequestDto reqDto) {
        try {
            long allergyMask = 0L;
            for (Long allergyId : reqDto.getOptionAllergies()) {
                allergyMask |= (1L << allergyId);
            }
            Option option = optionService.editOption(token, optionId, reqDto.getOptionName(), reqDto.getOptionPrice(), allergyMask);
            EditOptionResponseDto resDto = new EditOptionResponseDto(option.getId(), option.getName(), option.getPrice());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping({"/{optionId}/delete", "/{optionId}/delete/"})
    public  ResponseEntity<?> deleteOption(@PathVariable("optionId") Long optionId, @RequestHeader("Authorization") String token) {
        try {
            optionService.deleteOption(token, optionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
