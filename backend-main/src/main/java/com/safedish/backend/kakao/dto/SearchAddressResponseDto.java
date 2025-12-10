package com.safedish.backend.kakao.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchAddressResponseDto {
    @Setter
    @Getter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Document {
        @JsonProperty("y")
        Double latitude;

        @JsonProperty("x")
        Double longitude;
    }

    @JsonProperty("documents")
    private List<Document> documents;
}
