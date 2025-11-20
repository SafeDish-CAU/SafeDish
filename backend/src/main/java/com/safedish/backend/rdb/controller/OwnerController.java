package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.OwnerRequestDto;
import com.safedish.backend.rdb.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/owner")
public class OwnerController {
    private final OwnerService ownerService;

    @PostMapping({"", "/"})
    public ResponseEntity<?> postOwner(@RequestBody OwnerRequestDto dto) {
        try {
            ownerService.createOwner(dto.getEmail(), dto.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 사용 중인 이메일입니다.");
        }
    }
}
