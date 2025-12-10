package com.safedish.backend.recommend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateOrderRequestDto {
    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("menu_id")
    private Long menuId;

    @JsonProperty("quantity")
    private Long quantity;

    public CreateOrderRequestDto(String userId, Long menuId, Long quantity) {
        this.userId = userId;
        this.menuId = menuId;
        this.quantity = quantity;
    }
}
