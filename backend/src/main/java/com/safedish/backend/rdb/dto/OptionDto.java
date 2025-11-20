package com.safedish.backend.rdb.dto;

import com.safedish.backend.rdb.entity.Option;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OptionDto {
    @JsonProperty("option_id")
    private final Long id;

    @JsonProperty("option_name")
    private final String name;

    @JsonProperty("option_price")
    private final Long price;

    @JsonProperty("option_allergies")
    private final List<AllergyDto> allergies = new ArrayList<>();

    public OptionDto(Option option) {
        this.id = option.getId();
        this.name = option.getName();
        this.price = option.getPrice();

        long mask = option.getAllergyMask();
        for (int i = 0; i < 22; i++) {
            if ((mask & (1L << i)) != 0L) {
                AllergyDto allergyDto = new AllergyDto(i);
                this.allergies.add(allergyDto);
            }
        }
    }
}
