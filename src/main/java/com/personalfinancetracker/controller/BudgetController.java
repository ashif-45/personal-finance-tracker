package com.personalfinancetracker.controller;

import com.personalfinancetracker.dto.request.BudgetRequest;
import com.personalfinancetracker.dto.response.ApiResponse;
import com.personalfinancetracker.dto.response.BudgetAlertResponse;
import com.personalfinancetracker.dto.response.BudgetResponse;
import com.personalfinancetracker.dto.response.BulkUploadResponse;
import com.personalfinancetracker.service.BudgetService;
import com.personalfinancetracker.service.CsvImportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;
    private final CsvImportService csvImportService;

    public BudgetController(BudgetService budgetService, CsvImportService csvImportService) {
        this.budgetService = budgetService;
        this.csvImportService = csvImportService;
    }

    /** All budgets for the user (any month/year) */
    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getAllBudgets(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(budgetService.getAllBudgets(auth.getName())));
    }

    /**
     * Budgets for a specific month/year.
     * If month/year omitted → current month.
     * Examples:
     *   GET /api/budgets/by-period
     *   GET /api/budgets/by-period?month=3&year=2025
     */
    @GetMapping("/by-period")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgetsByPeriod(
            Authentication auth,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(ApiResponse.success(
                budgetService.getBudgetsByPeriod(auth.getName(), month, year)));
    }

    /** Keep /current as alias for current month */
    @GetMapping("/current")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getCurrentBudgets(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                budgetService.getBudgetsByPeriod(auth.getName(), null, null)));
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

    @PostMapping("/bulk-upload")
    public ResponseEntity<ApiResponse<BulkUploadResponse>> bulkUploadBudgets(
            Authentication auth,
            @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Please upload a valid CSV file"));
        }
        BulkUploadResponse response = csvImportService.importBudgets(auth.getName(), file);
        String msg = String.format("Imported %d of %d budgets successfully",
                response.successCount(), response.totalRows());
        return ResponseEntity.ok(ApiResponse.success(msg, response));
    }
}