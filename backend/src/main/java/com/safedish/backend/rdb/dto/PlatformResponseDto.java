package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlatformResponseDto {
    private final Long storeId;

    public PlatformResponseDto(Long storeId) {
        this.storeId = storeId;
    }
}
