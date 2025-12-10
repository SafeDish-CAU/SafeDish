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
    @JsonProperty("id")
    private final Long id;

    @JsonProperty("name")
    private final String name;

    @JsonProperty("type")
    private final Long type;

    @JsonProperty("road_address")
    private final String roadAddress;

    @JsonProperty("postal_code")
    private final String postalCode;

    @JsonProperty("detail_address")
    private final String detailAddress;

    @JsonProperty("menus")
    private final List<MenuDto> menus = new ArrayList<>();

    public StoreDto(Store store) {
        this.id = store.getId();
        this.name = store.getName();
        this.type = store.getType();
        this.roadAddress = store.getRoadAddress();
        this.postalCode = store.getPostalCode();
        this.detailAddress = store.getDetailAddress();

        for (Menu menu :  store.getMenus()) {
            this.menus.add(new MenuDto(menu));
        }
    }
}
