package com.safedish.backend.rdb.dto;

import com.safedish.backend.rdb.entity.Option;

public class ReadOptionResponseDto extends OptionDto {
    public ReadOptionResponseDto(Option option) {
        super(option);
    }
}
