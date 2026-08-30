package com.personalfinancetracker.controller;

import com.personalfinancetracker.dto.request.BudgetRequest;
import com.personalfinancetracker.dto.response.ApiResponse;
import com.personalfinancetracker.dto.response.BudgetAlertResponse;
import com.personalfinancetracker.dto.response.BudgetResponse;
import com.personalfinancetracker.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getAllBudgets(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(budgetService.getAllBudgets(auth.getName())));
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getCurrentBudgets(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(budgetService.getCurrentMonthBudgets(auth.getName())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(
            Authentication auth,
            @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.createBudget(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Budget created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.updateBudget(auth.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Budget updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            Authentication auth,
            @PathVariable Long id) {
        budgetService.deleteBudget(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Budget deleted successfully", null));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<BudgetAlertResponse>>> getAlerts(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(budgetService.getBudgetAlerts(auth.getName())));
    }
}