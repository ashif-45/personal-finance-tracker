package com.personalfinancetracker.dto.response;

import java.util.List;

public record BulkUploadResponse(
        int totalRows,
        int successCount,
        int failureCount,
        List<RowError> errors
) {
    public record RowError(
            int rowNumber,
            String message
    ) {}
}