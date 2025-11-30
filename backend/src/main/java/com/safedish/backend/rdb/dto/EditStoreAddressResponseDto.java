package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditStoreAddressResponseDto {
    @JsonProperty("store_id")
    private Long storeId;

    @JsonProperty("store_road_address")
    private String roadAddress;

    @JsonProperty("store_postal_code")
    private String postalCode;

    @JsonProperty("store_detail_address")
    private String detailAddress;

    public EditStoreAddressResponseDto(Long storeId, String roadAddress, String postalCode, String detailAddress) {
        this.storeId = storeId;
        this.roadAddress = roadAddress;
        this.postalCode = postalCode;
        this.detailAddress = detailAddress;
    }
}
