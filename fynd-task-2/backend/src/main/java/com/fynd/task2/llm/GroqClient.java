package com.fynd.task2.llm;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class GroqClient {

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String FALLBACK_USER_RESPONSE = "Thanks for your feedback! Your review has been recorded.";
    private static final String MODEL = "llama-3.3-70b-versatile";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    public GroqClient(
            @Value("${groq.api.key:}") String apiKey,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(GROQ_API_URL)
                .build();
    }

    public GroqResult analyzeReview(int rating, String reviewText) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("Groq API key not configured, using fallback response");
            return createFallbackResult("Groq API key not configured");
        }

        try {
            String prompt = buildPrompt(rating, reviewText);
            String requestBody = buildRequestBody(prompt);

            String response = restClient.post()
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + apiKey)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            return parseGroqResponse(response);
        } catch (RestClientException e) {
            log.error("Groq API call failed: {}", e.getMessage(), e);
            return createFallbackResult("Groq API call failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during Groq API call: {}", e.getMessage(), e);
            return createFallbackResult("Unexpected error: " + e.getMessage());
        }
    }

    private String buildPrompt(int rating, String reviewText) {
        return String.format("""
                You are analyzing a customer feedback/review for a product or service.
                
                Rating: %d out of 5 stars
                Review: %s
                
                Please analyze this review and provide a response in the following JSON format ONLY (no markdown, no code blocks, just pure JSON):
                {
                    "user_response": "A friendly, personalized response to the customer acknowledging their feedback",
                    "summary": "A brief 1-2 sentence summary of the key points from the review",
                    "actions": ["action1", "action2"]
                }
                
                The "actions" array should contain recommended follow-up actions for the business based on this feedback.
                If the rating is low (1-2), include actions to address concerns.
                If the rating is high (4-5), include actions to maintain satisfaction.
                
                IMPORTANT: Return ONLY valid JSON, no additional text or formatting.
                """, rating, reviewText);
    }

    private String buildRequestBody(String prompt) throws JsonProcessingException {
        Map<String, Object> requestMap = Map.of(
                "model", MODEL,
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                ),
                "temperature", 0.7,
                "max_tokens", 1024
        );
        return objectMapper.writeValueAsString(requestMap);
    }

    private GroqResult parseGroqResponse(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);

            // Navigate to the content in Groq's OpenAI-compatible response structure
            JsonNode choicesNode = rootNode.path("choices");
            if (choicesNode.isEmpty() || !choicesNode.isArray()) {
                log.error("No choices in Groq response");
                return createFallbackResult("No choices in Groq response");
            }

            JsonNode messageNode = choicesNode.get(0).path("message");
            String textContent = messageNode.path("content").asText();

            if (textContent == null || textContent.isBlank()) {
                log.error("Empty content in Groq response");
                return createFallbackResult("Empty content in Groq response");
            }

            // Clean up the response - remove markdown code blocks if present
            textContent = cleanJsonResponse(textContent);

            // Parse the JSON content from Groq's text response
            GroqResponseDto groqResponse = objectMapper.readValue(textContent, GroqResponseDto.class);

            return GroqResult.builder()
                    .success(true)
                    .userResponse(groqResponse.getUserResponse())
                    .summary(groqResponse.getSummary())
                    .actions(groqResponse.getActions())
                    .build();

        } catch (JsonProcessingException e) {
            log.error("Failed to parse Groq response JSON: {}", e.getMessage(), e);
            return createFallbackResult("Failed to parse Groq response: " + e.getMessage());
        }
    }

    private String cleanJsonResponse(String text) {
        // Remove markdown code blocks if present
        Pattern pattern = Pattern.compile("```(?:json)?\\s*([\\s\\S]*?)\\s*```");
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return text.trim();
    }

    private GroqResult createFallbackResult(String errorMessage) {
        return GroqResult.builder()
                .success(false)
                .userResponse(FALLBACK_USER_RESPONSE)
                .summary(null)
                .actions(List.of())
                .errorMessage(errorMessage)
                .build();
    }

    public static String getFallbackUserResponse() {
        return FALLBACK_USER_RESPONSE;
    }
}

