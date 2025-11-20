package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateMenuResponseDto {
    @JsonProperty("store_id")
    private Long storeId;

    @JsonProperty("menu_id")
    private Long menuId;

    @JsonProperty("menu_name")
    private String menuName;

    @JsonProperty("menu_price")
    private Long menuPrice;

    public CreateMenuResponseDto(Long storeId, Long menuId, String menuName, Long menuPrice) {
        this.storeId = storeId;
        this.menuId = menuId;
        this.menuName = menuName;
        this.menuPrice = menuPrice;
    }
}
