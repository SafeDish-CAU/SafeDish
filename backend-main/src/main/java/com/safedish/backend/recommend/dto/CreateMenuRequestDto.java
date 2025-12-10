package com.safedish.backend.recommend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateMenuRequestDto {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("store_id")
    private Long storeId;

    @JsonProperty("category")
    private Long type;

    @JsonProperty("allergy")
    private Long allergyMask;

    public CreateMenuRequestDto(Long id, Long storeId, Long type, Long allergyMask) {
        this.id = id;
        this.storeId = storeId;
        this.type = type;
        this.allergyMask = allergyMask;
    }
}
