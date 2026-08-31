package com.personalfinancetracker.controller;

import com.personalfinancetracker.dto.request.TransactionRequest;
import com.personalfinancetracker.dto.response.ApiResponse;
import com.personalfinancetracker.dto.response.PageResponse;
import com.personalfinancetracker.dto.response.TransactionResponse;
import com.personalfinancetracker.entity.enums.TransactionType;
import com.personalfinancetracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.personalfinancetracker.dto.response.BulkUploadResponse;
import com.personalfinancetracker.service.CsvImportService;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final CsvImportService csvImportService;

    public TransactionController(TransactionService transactionService,
                                 CsvImportService csvImportService) {
        this.transactionService = transactionService;
        this.csvImportService = csvImportService;
    }
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TransactionResponse>>> getTransactions(
            Authentication auth,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        PageResponse<TransactionResponse> response = transactionService.getTransactions(
                auth.getName(), startDate, endDate, categoryId, type, search, page, size, sortBy, sortDirection
        );
        return ResponseEntity.ok(ApiResponse.success(response));
        
        
    }
    
    @PostMapping("/bulk-upload")
    public ResponseEntity<ApiResponse<BulkUploadResponse>> bulkUploadTransactions(
            Authentication auth,
            @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Please upload a valid CSV file"));
        }
        BulkUploadResponse response = csvImportService.importTransactions(auth.getName(), file);
        String msg = String.format("Imported %d of %d transactions successfully",
                response.successCount(), response.totalRows());
        return ResponseEntity.ok(ApiResponse.success(msg, response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransactionById(
            Authentication auth,
            @PathVariable Long id) {
        TransactionResponse response = transactionService.getTransactionById(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(
            Authentication auth,
            @Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.createTransaction(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Transaction created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateTransaction(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.updateTransaction(auth.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Transaction updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            Authentication auth,
            @PathVariable Long id) {
        transactionService.deleteTransaction(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted successfully", null));
    }
}