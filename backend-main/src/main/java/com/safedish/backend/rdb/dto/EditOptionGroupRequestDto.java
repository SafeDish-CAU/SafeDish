package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditOptionGroupRequestDto {
    @JsonProperty("name")
    private String name;

    @JsonProperty("min_selected")
    private Long minSelected;

    @JsonProperty("max_selected")
    private Long maxSelected;
}
