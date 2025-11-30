package com.safedish.backend.rdb.dto;

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
        @JsonProperty("x")
        Double latitude;

        @JsonProperty("y")
        Double longitude;
    }

    @JsonProperty("documents")
    private List<Document> documents;
}
