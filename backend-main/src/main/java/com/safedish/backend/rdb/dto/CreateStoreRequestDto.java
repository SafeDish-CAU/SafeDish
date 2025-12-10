package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateStoreRequestDto {
    @JsonProperty("name")
    private String name;

    @JsonProperty("type")
    private Long type;

    @JsonProperty("road_address")
    private String roadAddress;

    @JsonProperty("postal_code")
    private String postalCode;

    @JsonProperty("detail_address")
    private String detailAddress;
}
