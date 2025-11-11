package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AllergyDto {
    private final Long code;
    private final String description;

    public AllergyDto(Long code, String description) {
        this.code = code;
        this.description = description;
    }
}
