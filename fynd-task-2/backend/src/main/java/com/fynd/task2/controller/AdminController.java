package com.fynd.task2.controller;

import com.fynd.task2.dto.AdminReviewListResponseDto;
import com.fynd.task2.dto.AnalyticsResponseDto;
import com.fynd.task2.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@Slf4j
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/reviews")
    public ResponseEntity<AdminReviewListResponseDto> getReviews(
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false, defaultValue = "50") Integer limit,
            @RequestParam(required = false, defaultValue = "0") Integer offset,
            @RequestParam(required = false) String search
    ) {
        log.info("Admin fetching reviews - rating: {}, limit: {}, offset: {}, search: {}",
                rating, limit, offset, search);
        AdminReviewListResponseDto response = adminService.getReviews(rating, limit, offset, search);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsResponseDto> getAnalytics() {
        log.info("Admin fetching analytics");
        AnalyticsResponseDto response = adminService.getAnalytics();
        return ResponseEntity.ok(response);
    }
}

