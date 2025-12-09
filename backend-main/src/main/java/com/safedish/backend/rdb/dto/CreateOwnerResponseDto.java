package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateOwnerResponseDto {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("token")
    private final String token;

    public CreateOwnerResponseDto(Long id, String token) {
        this.id = id;
        this.token = token;
    }
}
