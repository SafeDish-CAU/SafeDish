package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.safedish.backend.rdb.entitiy.Menu;
import com.safedish.backend.rdb.entitiy.Store;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StoreResponseDto {
    private final Long storeId;
    private final String storeName;
    private final List<MenuDto> menus = new ArrayList<>();

    public StoreResponseDto(Store store) {
        this.storeId = store.getId();
        this.storeName = store.getName();
        for (Menu elem :  store.getMenus()) {
            this.menus.add(new MenuDto(elem));
        }
    }
}
