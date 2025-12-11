package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReadPlatformsByStoreIdResponseDto {
    @Getter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Item {
        @JsonProperty("pf_name")
        String name;

        @JsonProperty("pf_sid")
        Long sid;

        public Item(String name, Long sid) {
            this.name = name;
            this.sid = sid;
        }
    }

    @JsonProperty("items")
    List<Item> items = new ArrayList<>();

    public void addItem(Item item) {
        items.add(item);
    }
}
