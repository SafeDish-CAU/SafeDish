package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateOptionItemResponseDto {
    @JsonProperty("group_id")
    private Long groupId;

    @JsonProperty("id")
    private Long id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("price")
    private Long price;

    @JsonProperty("allergies")
    private final List<AllergyDto> allergies = new ArrayList<>();

    public CreateOptionItemResponseDto(Long groupId, Long id, String name, Long price, Long allergyMask) {
        this.groupId = groupId;
        this.id = id;
        this.name = name;
        this.price = price;

        for (int i = 0; i < 22; i++) {
            if ((allergyMask & (1L << i)) != 0L) {
                AllergyDto allergyDto = new AllergyDto(i);
                this.allergies.add(allergyDto);
            }
        }
    }
}
