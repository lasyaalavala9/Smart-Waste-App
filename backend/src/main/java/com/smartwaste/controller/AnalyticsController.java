package com.smartwaste.controller;

import com.smartwaste.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/authority")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getAuthorityDashboardStats());
    }

    @GetMapping("/recycling")
    public ResponseEntity<Map<String, Object>> getRecyclingStats() {
        return ResponseEntity.ok(analyticsService.getRecyclingStats());
    }

    @GetMapping("/trends")
    public ResponseEntity<Map<String, Object>> getWeeklyTrends() {
        return ResponseEntity.ok(analyticsService.getWeeklyTrends());
    }
}
