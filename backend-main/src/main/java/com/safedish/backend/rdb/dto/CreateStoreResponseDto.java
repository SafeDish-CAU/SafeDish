package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateStoreResponseDto {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("name")
    private String name;

    public CreateStoreResponseDto(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
