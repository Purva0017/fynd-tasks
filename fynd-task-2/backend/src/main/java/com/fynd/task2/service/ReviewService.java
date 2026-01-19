package com.fynd.task2.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fynd.task2.dto.ReviewRequestDto;
import com.fynd.task2.dto.ReviewResponseDto;
import com.fynd.task2.entity.ReviewSubmission;
import com.fynd.task2.entity.SubmissionStatus;
import com.fynd.task2.llm.GroqClient;
import com.fynd.task2.llm.GroqResult;
import com.fynd.task2.repository.ReviewSubmissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class ReviewService {

    private final ReviewSubmissionRepository reviewSubmissionRepository;
    private final GroqClient groqClient;
    private final ObjectMapper objectMapper;

    public ReviewService(
            ReviewSubmissionRepository reviewSubmissionRepository,
            GroqClient groqClient,
            ObjectMapper objectMapper
    ) {
        this.reviewSubmissionRepository = reviewSubmissionRepository;
        this.groqClient = groqClient;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ReviewResponseDto submitReview(ReviewRequestDto request) {
        log.info("Processing review submission with rating: {}", request.getRating());

        // Call Groq to analyze the review
        GroqResult groqResult = groqClient.analyzeReview(
                request.getRating(),
                request.getReview()
        );

        // Build and save the submission
        ReviewSubmission submission = buildSubmission(request, groqResult);
        ReviewSubmission savedSubmission = reviewSubmissionRepository.save(submission);

        log.info("Review submission saved with id: {}, status: {}",
                savedSubmission.getId(), savedSubmission.getStatus());

        // Always return success to user with fallback response if needed
        return ReviewResponseDto.builder()
                .id(savedSubmission.getId())
                .aiResponse(savedSubmission.getAiUserResponse())
                .createdAt(savedSubmission.getCreatedAt())
                .build();
    }

    private ReviewSubmission buildSubmission(ReviewRequestDto request, GroqResult groqResult) {
        ReviewSubmission.ReviewSubmissionBuilder builder = ReviewSubmission.builder()
                .rating(request.getRating())
                .reviewText(request.getReview())
                .aiUserResponse(groqResult.getUserResponse());

        if (groqResult.isSuccess()) {
            builder.status(SubmissionStatus.SUCCESS)
                    .aiSummary(groqResult.getSummary())
                    .aiRecommendedActions(serializeActions(groqResult.getActions()));
        } else {
            builder.status(SubmissionStatus.FAILED)
                    .errorMessage(groqResult.getErrorMessage())
                    .aiSummary(null)
                    .aiRecommendedActions(null);
        }

        return builder.build();
    }

    private String serializeActions(List<String> actions) {
        if (actions == null || actions.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(actions);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize actions: {}", e.getMessage());
            return null;
        }
    }
}

