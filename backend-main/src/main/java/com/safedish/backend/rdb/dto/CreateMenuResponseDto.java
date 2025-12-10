package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateMenuResponseDto {
    @JsonProperty("store_id")
    private Long storeId;

    @JsonProperty("id")
    private Long id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("type")
    private Long type;

    @JsonProperty("price")
    private Long price;

    @JsonProperty("allergies")
    private final List<AllergyDto> allergies = new ArrayList<>();

    public CreateMenuResponseDto(Long storeId, Long id, String name, Long type, Long price, Long allergyMask) {
        this.storeId = storeId;
        this.id = id;
        this.name = name;
        this.type = type;
        this.price = price;

        for (int i = 0; i < 22; i++) {
            if ((allergyMask & (1L << i)) != 0L) {
                AllergyDto allergyDto = new AllergyDto(i);
                this.allergies.add(allergyDto);
            }
        }
    }
}
