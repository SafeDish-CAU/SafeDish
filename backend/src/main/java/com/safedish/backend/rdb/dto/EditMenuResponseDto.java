package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditMenuResponseDto {
    @JsonProperty("menu_id")
    private Long menuId;

    @JsonProperty("menu_name")
    private String menuName;

    @JsonProperty("menu_price")
    private Long menuPrice;

    public EditMenuResponseDto(Long menuId, String menuName, Long menuPrice) {
        this.menuId = menuId;
        this.menuName = menuName;
        this.menuPrice = menuPrice;
    }
}
