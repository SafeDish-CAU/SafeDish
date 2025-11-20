package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateOwnerResponseDto {
    @JsonProperty("owner_id")
    private Long ownerId;

    @JsonProperty("token")
    private final String token;

    public CreateOwnerResponseDto(Long ownerId, String token) {
        this.ownerId = ownerId;
        this.token = token;
    }
}
