package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReadStoresResponseDto {
    @Getter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Item {
        @JsonProperty("id")
        Long id;

        @JsonProperty("name")
        String name;

        @JsonProperty("road_address")
        String roadAddress;

        @JsonProperty("postal_code")
        String postalCode;

        @JsonProperty("detail_address")
        String detailAddress;

        public Item(Long id, String name, String roadAddress, String postalCode, String detailAddress) {
            this.id = id;
            this.name = name;
            this.roadAddress = roadAddress;
            this.postalCode = postalCode;
            this.detailAddress = detailAddress;
        }
    }

    @JsonProperty("items")
    List<Item> items = new ArrayList<>();

    public void addItem(Item item) {
        items.add(item);
    }
}
