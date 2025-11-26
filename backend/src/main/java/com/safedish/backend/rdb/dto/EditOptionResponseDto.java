package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditOptionResponseDto {
    @JsonProperty("option_id")
    private Long optionId;

    @JsonProperty("option_name")
    private String optionName;

    @JsonProperty("option_price")
    private Long optionPrice;

    public EditOptionResponseDto(Long optionId, String optionName, Long optionPrice) {
        this.optionId = optionId;
        this.optionName = optionName;
        this.optionPrice = optionPrice;
    }
}
