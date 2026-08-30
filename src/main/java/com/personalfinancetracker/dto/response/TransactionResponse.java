package com.personalfinancetracker.dto.response;

import com.personalfinancetracker.entity.enums.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        BigDecimal amount,
        TransactionType type,
        String description,
        LocalDate transactionDate,
        CategoryResponse category,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}