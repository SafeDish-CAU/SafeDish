package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.CreateOwnerRequestDto;
import com.safedish.backend.rdb.dto.CreateOwnerResponseDto;
import com.safedish.backend.rdb.entity.Owner;
import com.safedish.backend.rdb.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/owner")
public class OwnerController {
    private final OwnerService ownerService;

    @PostMapping({"", "/"})
    public ResponseEntity<?> createOwner(@RequestBody CreateOwnerRequestDto dto) {
        try {
            Owner owner = ownerService.createOwner(dto.getEmail(), dto.getPassword());
            CreateOwnerResponseDto resDto = new CreateOwnerResponseDto(owner.getId(), owner.getToken());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 사용 중인 이메일입니다.");
        }
    }
}
