package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InferAllergyResponseDto {
    @JsonProperty("allergies")
    List<Long> allergies;

    public InferAllergyResponseDto(List<Long> allergies) {
        this.allergies = allergies;
    }
}