package com.fynd.task2.llm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroqResult {

    private boolean success;
    private String userResponse;
    private String summary;
    private List<String> actions;
    private String errorMessage;
}

