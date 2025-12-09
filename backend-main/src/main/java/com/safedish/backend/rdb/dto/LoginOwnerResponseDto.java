package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginOwnerResponseDto {
    @JsonProperty("id")
    private final Long id;

    @JsonProperty("token")
    private final String token;

    public LoginOwnerResponseDto(Long id, String token) {
        this.id = id;
        this.token = token;
    }
}
