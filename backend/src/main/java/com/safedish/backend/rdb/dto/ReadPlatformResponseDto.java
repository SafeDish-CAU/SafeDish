package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReadPlatformResponseDto {
    @JsonProperty("store_id")
    private final Long storeId;

    public ReadPlatformResponseDto(Long storeId) {
        this.storeId = storeId;
    }
}
