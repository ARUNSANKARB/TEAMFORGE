package com.teamforge.controller;

import com.teamforge.dto.AnalyticsDto;
import com.teamforge.dto.ApiResponse;
import com.teamforge.dto.EvaluationMetricsDto;
import com.teamforge.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/system")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getSystemAnalytics() {
        AnalyticsDto analytics = analyticsService.getSystemAnalytics();
        return ResponseEntity.ok(ApiResponse.ok(analytics));
    }

    @GetMapping("/evaluation")
    public ResponseEntity<ApiResponse<EvaluationMetricsDto>> getResearchEvaluationMetrics() {
        EvaluationMetricsDto metrics = analyticsService.getResearchEvaluationMetrics();
        return ResponseEntity.ok(ApiResponse.ok(metrics));
    }
}
