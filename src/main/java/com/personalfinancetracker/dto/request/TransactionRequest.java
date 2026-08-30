package com.personalfinancetracker.dto.request;

import com.personalfinancetracker.entity.enums.TransactionType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        @Digits(integer = 10, fraction = 2, message = "Amount format is invalid (up to 2 decimals)")
        BigDecimal amount,

        @NotNull(message = "Transaction type is required (INCOME or EXPENSE)")
        TransactionType type,

        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description,

        @NotNull(message = "Transaction date is required")
        LocalDate transactionDate,

        @NotNull(message = "Category ID is required")
        Long categoryId
) {}