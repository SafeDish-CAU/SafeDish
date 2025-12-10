package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.safedish.backend.rdb.entity.Menu;
import com.safedish.backend.rdb.entity.OptionGroup;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MenuDto {
    @JsonProperty("id")
    private final Long id;

    @JsonProperty("name")
    private final String name;

    @JsonProperty("type")
    private final Long type;

    @JsonProperty("price")
    private final Long price;

    @JsonProperty("allergies")
    private final List<AllergyDto> allergies = new ArrayList<>();

    @JsonProperty("options")
    private final List<OptionGroupDto> options = new ArrayList<>();

    public MenuDto(Menu menu) {
        this.id = menu.getId();
        this.name = menu.getName();
        this.type = menu.getType();
        this.price = menu.getPrice();

        long mask = menu.getAllergyMask();
        for (int i = 0; i < 22; i++) {
            if ((mask & (1L << i)) != 0L) {
                AllergyDto allergyDto = new AllergyDto(i);
                this.allergies.add(allergyDto);
            }
        }

        for (OptionGroup group : menu.getOptions()) {
            this.options.add(new OptionGroupDto(group));
        }
    }
}
