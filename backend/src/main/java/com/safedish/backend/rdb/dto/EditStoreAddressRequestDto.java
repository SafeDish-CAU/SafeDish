package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditStoreAddressRequestDto {
    @JsonProperty("store_road_address")
    private String roadAddress;

    @JsonProperty("store_postal_code")
    private String postalCode;

    @JsonProperty("store_detail_address")
    private String detailAddress;
}
