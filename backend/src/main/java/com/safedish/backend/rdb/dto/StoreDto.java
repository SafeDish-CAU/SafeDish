package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.safedish.backend.rdb.entity.Menu;
import com.safedish.backend.rdb.entity.Store;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StoreDto {
    @JsonProperty("store_id")
    private final Long storeId;

    @JsonProperty("store_name")
    private final String storeName;

    @JsonProperty("menus")
    private final List<MenuDto> menus = new ArrayList<>();

    public StoreDto(Store store) {
        this.storeId = store.getId();
        this.storeName = store.getName();
        for (Menu elem :  store.getMenus()) {
            this.menus.add(new MenuDto(elem));
        }
    }
}
