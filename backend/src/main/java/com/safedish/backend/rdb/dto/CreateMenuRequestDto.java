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
public class CreateMenuRequestDto {
    @JsonProperty("store_id")
    private Long storeId;

    @JsonProperty("menu_name")
    private String menuName;

    @JsonProperty("menu_price")
    private Long menuPrice;

    @JsonProperty("menu_allergies")
    private List<Long> menuAllergies = new ArrayList<>();
}
