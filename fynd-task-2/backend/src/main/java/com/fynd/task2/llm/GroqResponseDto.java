package com.fynd.task2.llm;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroqResponseDto {

    @JsonProperty("user_response")
    private String userResponse;

    @JsonProperty("summary")
    private String summary;

    @JsonProperty("actions")
    private List<String> actions;
}
