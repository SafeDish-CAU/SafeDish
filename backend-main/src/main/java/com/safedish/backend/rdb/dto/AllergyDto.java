package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.List;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AllergyDto {
    private static final List<String> ALLERGY_NAMES = List.of(
            "알류(가금류)", // 0 EGGS
            "우유",         // 1 MILK
            "메밀",         // 2 BUCKWHEAT
            "땅콩",         // 3 PEANUT
            "대두",         // 4 SOYBEAN
            "밀",           // 5 WHEAT
            "고등어",       // 6 MACKEREL
            "게",           // 7 CRAB
            "새우",         // 8 SHRIMP
            "돼지고기",     // 9 PORK
            "복숭아",       // 10 PEACH
            "토마토",       // 11 TOMATO
            "아황산류",     // 12 SULFUROUSACIDS
            "호두",         // 13 WALNUT
            "닭고기",       // 14 CHICKEN
            "쇠고기",       // 15 BEEF
            "오징어",       // 16 SQUID
            "굴",           // 17 OYSTER
            "전복",         // 18 ABALONE
            "홍합",         // 19 MUSSEL
            "조개류",       // 20 SHELLFISH
            "잣",            // 21 PINENUT
            "고열량·저영양",
            "GMO 식품",
            "고카페인"
    );

    @JsonProperty("code")
    private final Long code;

    @JsonProperty("description")
    private final String description;

    public AllergyDto(int code) {
        this.code = (long)code;
        this.description = ALLERGY_NAMES.get(code);
    }
}
