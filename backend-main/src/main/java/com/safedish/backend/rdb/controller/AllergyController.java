package com.safedish.backend.rdb.controller;

import com.safedish.backend.openai.service.ChatGptService;
import com.safedish.backend.rdb.dto.InferAllergyRequestDto;
import com.safedish.backend.rdb.dto.InferAllergyResponseDto;
import com.safedish.backend.rdb.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/allergy")
public class AllergyController {
    private final OwnerService ownerService;
    private final ChatGptService chatGptService;

    @PostMapping({"/infer", "/infer/"})
    public ResponseEntity<?> inferAllergy(@RequestHeader("Authorization") String token, @RequestBody InferAllergyRequestDto reqDto) {
        try {
            ownerService.verifyToken(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Long> allergies = null;
        String type =  reqDto.getType();
        if (type.equals("main")) {
            try {
               allergies = chatGptService.inferMainAllergies(reqDto.getMenuName(), reqDto.getDescription());
            } catch (Exception e) {
                System.out.println(e.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ChatGPT API 오류");
            }
        } else if (type.equals("option")) {
            try {
                allergies = chatGptService.inferOptionAllergies(reqDto.getMenuName(), reqDto.getGroupName(), reqDto.getItemName(), reqDto.getDescription());
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ChatGPT API 오류");
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        InferAllergyResponseDto resDto = new InferAllergyResponseDto(allergies);
        return ResponseEntity.ok(resDto);
    }
}
