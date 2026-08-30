package com.personalfinancetracker.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record BudgetRequest(
        @NotNull(message = "Budget amount is required")
        @DecimalMin(value = "1.00", message = "Budget amount must be at least 1.00")
        @Digits(integer = 10, fraction = 2, message = "Invalid amount format")
        BigDecimal amount,

        @NotNull(message = "Month is required")
        @Min(value = 1, message = "Month must be between 1 and 12")
        @Max(value = 12, message = "Month must be between 1 and 12")
        Integer month,

        @NotNull(message = "Year is required")
        @Min(value = 2020, message = "Year must be 2020 or later")
        @Max(value = 2100, message = "Year must be 2100 or earlier")
        Integer year,

        Long categoryId,  // null = overall budget for the month

        @Min(value = 10, message = "Alert threshold must be at least 10%")
        @Max(value = 100, message = "Alert threshold cannot exceed 100%")
        Integer alertThreshold
) {}