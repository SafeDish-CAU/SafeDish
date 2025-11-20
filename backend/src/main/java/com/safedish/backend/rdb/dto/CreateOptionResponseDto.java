package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateOptionResponseDto {
    @JsonProperty("menu_id")
    private Long menuId;

    @JsonProperty("option_id")
    private Long optionId;

    @JsonProperty("option_name")
    private String optionName;

    @JsonProperty("option_price")
    private Long optionPrice;

    public CreateOptionResponseDto(Long menuId, Long optionId, String optionName, Long optionPrice) {
        this.menuId = menuId;
        this.optionId = optionId;
        this.optionName = optionName;
        this.optionPrice = optionPrice;
    }
}
