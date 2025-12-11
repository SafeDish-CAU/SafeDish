package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InferAllergyRequestDto {
    @JsonProperty("type")
    private String type;

    @JsonProperty("menu_name")
    private String menuName;

    @JsonProperty("option_group_name")
    private String groupName;

    @JsonProperty("option_item_name")
    private String itemName;

    @JsonProperty("description")
    private String description;
}
