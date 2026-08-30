package com.personalfinancetracker.controller;

import com.personalfinancetracker.dto.response.ApiResponse;
import com.personalfinancetracker.dto.response.ReportResponse;
import com.personalfinancetracker.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<ReportResponse>> getMonthlyReport(
            Authentication auth,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().year}") int year) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getMonthlyReport(auth.getName(), year)));
    }

    @GetMapping("/yearly")
    public ResponseEntity<ApiResponse<ReportResponse>> getYearlyReport(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(reportService.getYearlyReport(auth.getName())));
    }

    @GetMapping("/category")
    public ResponseEntity<ApiResponse<ReportResponse>> getCategoryReport(
            Authentication auth,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().monthValue}") int month,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().year}") int year) {
        return ResponseEntity.ok(ApiResponse.success(
                reportService.getCategoryReport(auth.getName(), month, year)));
    }
}