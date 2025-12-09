package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.safedish.backend.rdb.entity.OptionGroup;
import com.safedish.backend.rdb.entity.OptionItem;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OptionGroupDto {
    @JsonProperty("id")
    private final Long id;

    @JsonProperty("name")
    private final String name;

    @JsonProperty("min_selected")
    private final Long minSelected;

    @JsonProperty("max_selected")
    private final Long maxSelected;

    @JsonProperty("items")
    private final List<OptionItemDto> items = new ArrayList<>();

    public OptionGroupDto(OptionGroup optionGroup) {
        this.id = optionGroup.getId();
        this.name = optionGroup.getName();
        this.minSelected = optionGroup.getMinSelected();
        this.maxSelected = optionGroup.getMaxSelected();

        for (OptionItem item : optionGroup.getItems()) {
            this.items.add(new OptionItemDto(item));
        }
    }
}
