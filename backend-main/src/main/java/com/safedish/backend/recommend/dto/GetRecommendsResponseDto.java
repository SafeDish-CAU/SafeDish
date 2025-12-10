package com.safedish.backend.recommend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GetRecommendsResponseDto {
    @Getter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Item {
        @JsonProperty("store_id")
        Long storeId;

        @JsonProperty("store_name")
        String storeName;

        @JsonProperty("menu_id")
        Long menuId;

        @JsonProperty("menu_name")
        String menuName;

        public Item(Long storeId, String storeName, Long menuId, String menuName) {
            this.storeId = storeId;
            this.storeName = storeName;
            this.menuId = menuId;
            this.menuName = menuName;
        }
    }

    @JsonProperty("items")
    private List<Item> items = new ArrayList<>();

    public void addItem(Item item) {
        items.add(item);
    }
}
