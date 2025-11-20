package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateOptionRequestDto {
    @JsonProperty("menu_id")
    private Long menuId;

    @JsonProperty("option_name")
    private String optionName;

    @JsonProperty("option_price")
    private Long optionPrice;

    @JsonProperty("option_allergies")
    private List<Long> optionAllergies = new ArrayList<>();
}
