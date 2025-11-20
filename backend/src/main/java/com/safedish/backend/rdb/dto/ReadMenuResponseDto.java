package com.safedish.backend.rdb.dto;

import com.safedish.backend.rdb.entity.Menu;

public class ReadMenuResponseDto extends MenuDto {
    public ReadMenuResponseDto(Menu menu) {
        super(menu);
    }
}
