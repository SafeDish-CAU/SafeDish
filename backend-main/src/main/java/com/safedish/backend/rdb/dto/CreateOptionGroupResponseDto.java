package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateOptionGroupResponseDto {
    @JsonProperty("menu_id")
    private Long menuId;

    @JsonProperty("id")
    private Long id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("min_selected")
    private Long minSelected;

    @JsonProperty("max_selected")
    private Long maxSelected;

    public CreateOptionGroupResponseDto(Long menuId, Long id, String name, Long minSelected, Long maxSelected) {
        this.menuId = menuId;
        this.id = id;
        this.name = name;
        this.minSelected = minSelected;
        this.maxSelected = maxSelected;
    }
}
