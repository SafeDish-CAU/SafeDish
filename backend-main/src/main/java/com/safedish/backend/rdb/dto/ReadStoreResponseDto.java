package com.safedish.backend.rdb.dto;

import com.safedish.backend.rdb.entity.Store;

public class ReadStoreResponseDto extends StoreDto {
    public ReadStoreResponseDto(Store store) {
        super(store);
    }
}
