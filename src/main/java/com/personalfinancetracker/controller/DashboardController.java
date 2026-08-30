package com.personalfinancetracker.controller;

import com.personalfinancetracker.dto.response.ApiResponse;
import com.personalfinancetracker.dto.response.DashboardResponse;
import com.personalfinancetracker.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardResponse>> getSummary(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getSummary(auth.getName())));
    }
}