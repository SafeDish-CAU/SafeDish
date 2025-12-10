package com.safedish.backend.recommend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GetRecommendsRequestDto {
    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("allergy")
    private Long allergyMask;

    public GetRecommendsRequestDto(String userId, Long allergyMask) {
        this.userId = userId;
        this.allergyMask = allergyMask;
    }
}
