package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreatePlatformResponseDto {
    @JsonProperty("store_id")
    private Long storeId;

    @JsonProperty("pf_name")
    private String platformName;

    @JsonProperty("pf_sid")
    private Long platformSid;

    public CreatePlatformResponseDto(Long storeId, String platformName, Long platformSid) {
        this.storeId = storeId;
        this.platformName = platformName;
        this.platformSid = platformSid;
    }
}
