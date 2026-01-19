package com.fynd.task2.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fynd.task2.dto.AdminReviewItemDto;
import com.fynd.task2.dto.AdminReviewListResponseDto;
import com.fynd.task2.dto.AnalyticsResponseDto;
import com.fynd.task2.entity.ReviewSubmission;
import com.fynd.task2.repository.ReviewSubmissionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdminService {

    private final ReviewSubmissionRepository reviewSubmissionRepository;
    private final ObjectMapper objectMapper;

    public AdminService(ReviewSubmissionRepository reviewSubmissionRepository, ObjectMapper objectMapper) {
        this.reviewSubmissionRepository = reviewSubmissionRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public AdminReviewListResponseDto getReviews(Integer rating, Integer limit, Integer offset, String search) {
        int pageSize = limit != null && limit > 0 ? Math.min(limit, 100) : 50;
        int pageNumber = offset != null && offset >= 0 ? offset / pageSize : 0;

        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<ReviewSubmission> page = fetchReviews(rating, search, pageable);

        List<AdminReviewItemDto> items = page.getContent().stream()
                .map(this::mapToAdminReviewItem)
                .collect(Collectors.toList());

        return AdminReviewListResponseDto.builder()
                .items(items)
                .total(page.getTotalElements())
                .build();
    }

    private Page<ReviewSubmission> fetchReviews(Integer rating, String search, Pageable pageable) {
        boolean hasRating = rating != null;
        boolean hasSearch = search != null && !search.isBlank();

        if (hasRating && hasSearch) {
            return reviewSubmissionRepository.findByRatingAndReviewTextContainingOrderByCreatedAtDesc(
                    rating, search.trim(), pageable);
        } else if (hasRating) {
            return reviewSubmissionRepository.findByRatingOrderByCreatedAtDesc(rating, pageable);
        } else if (hasSearch) {
            return reviewSubmissionRepository.findByReviewTextContainingOrderByCreatedAtDesc(
                    search.trim(), pageable);
        } else {
            return reviewSubmissionRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
    }

    private AdminReviewItemDto mapToAdminReviewItem(ReviewSubmission submission) {
        List<String> actions = deserializeActions(submission.getAiRecommendedActions());

        return AdminReviewItemDto.builder()
                .id(submission.getId())
                .rating(submission.getRating())
                .review(submission.getReviewText())
                .aiSummary(submission.getAiSummary())
                .aiActions(actions)
                .status(submission.getStatus().name())
                .errorMessage(submission.getErrorMessage())
                .createdAt(submission.getCreatedAt())
                .build();
    }

    private List<String> deserializeActions(String actionsJson) {
        if (actionsJson == null || actionsJson.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(actionsJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize actions: {}", e.getMessage());
            return List.of();
        }
    }

    @Transactional(readOnly = true)
    public AnalyticsResponseDto getAnalytics() {
        long total = reviewSubmissionRepository.count();

        List<Object[]> ratingCounts = reviewSubmissionRepository.countByRatingGrouped();

        Map<String, Long> countByRating = new LinkedHashMap<>();
        // Initialize all ratings with 0
        for (int i = 1; i <= 5; i++) {
            countByRating.put(String.valueOf(i), 0L);
        }

        // Fill in actual counts
        for (Object[] row : ratingCounts) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            countByRating.put(String.valueOf(rating), count);
        }

        return AnalyticsResponseDto.builder()
                .total(total)
                .countByRating(countByRating)
                .build();
    }
}
