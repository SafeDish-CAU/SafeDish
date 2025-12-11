package com.safedish.backend.rdb.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeletePlatformRequestDto {
    @JsonProperty("pf_name")
    private String pfName;

    @JsonProperty("pf_sid")
    private Long pfSid;
}
