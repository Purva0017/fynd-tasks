package com.fynd.task2.controller;

import com.fynd.task2.dto.ReviewRequestDto;
import com.fynd.task2.dto.ReviewResponseDto;
import com.fynd.task2.service.ReviewService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@Slf4j
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponseDto> submitReview(@Valid @RequestBody ReviewRequestDto request) {
        log.info("Received review submission request with rating: {}", request.getRating());
        ReviewResponseDto response = reviewService.submitReview(request);
        return ResponseEntity.ok(response);
    }
}
