package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.safedish.backend.rdb.entity.Menu;
import com.safedish.backend.rdb.entity.Option;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MenuDto {
    @JsonProperty("menu_id")
    private final Long id;

    @JsonProperty("menu_name")
    private final String name;

    @JsonProperty("menu_price")
    private final Long price;

    @JsonProperty("menu_allergies")
    private final List<AllergyDto> allergies = new ArrayList<>();

    @JsonProperty("menu_options")
    private final List<OptionDto> options = new ArrayList<>();

    public MenuDto(Menu menu) {
        this.id = menu.getId();
        this.name = menu.getName();
        this.price = menu.getPrice();

        long mask = menu.getAllergyMask();
        for (int i = 0; i < 22; i++) {
            if ((mask & (1L << i)) != 0L) {
                AllergyDto allergyDto = new AllergyDto(i);
                this.allergies.add(allergyDto);
            }
        }

        for (Option elem : menu.getOptions()) {
            this.options.add(new OptionDto(elem));
        }
    }
}
