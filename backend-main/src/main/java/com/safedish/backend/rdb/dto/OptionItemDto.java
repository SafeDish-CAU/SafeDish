package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.safedish.backend.rdb.entity.OptionItem;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OptionItemDto {
    @JsonProperty("id")
    private final Long id;

    @JsonProperty("name")
    private final String name;

    @JsonProperty("price")
    private final Long price;

    @JsonProperty("allergies")
    private final List<AllergyDto> allergies = new ArrayList<>();

    public OptionItemDto(OptionItem optionItem) {
        this.id = optionItem.getId();
        this.name = optionItem.getName();
        this.price = optionItem.getPrice();

        long mask = optionItem.getAllergyMask();
        for (int i = 0; i < 22; i++) {
            if ((mask & (1L << i)) != 0L) {
                AllergyDto allergyDto = new AllergyDto(i);
                this.allergies.add(allergyDto);
            }
        }
    }
}
