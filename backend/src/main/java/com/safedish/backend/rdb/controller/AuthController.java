package com.safedish.backend.rdb.controller;

import com.safedish.backend.rdb.dto.LoginOwnerRequestDto;
import com.safedish.backend.rdb.dto.LoginOwnerResponseDto;
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
@RequestMapping("/api/auth")
public class AuthController {
    private final OwnerService ownerService;

    @PostMapping({"/login", "/login/"})
    public ResponseEntity<?> loginOwner(@RequestBody LoginOwnerRequestDto reqDto) {
        try {
            Owner owner = ownerService.resetToken(reqDto.getEmail(), reqDto.getPassword());
            LoginOwnerResponseDto resDto = new LoginOwnerResponseDto(owner.getId(), owner.getToken());
            return ResponseEntity.ok(resDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("이메일 혹은 비밀번호가 일치하지 않습니다.");
        }
    }
}
