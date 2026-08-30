package com.personalfinancetracker.dto.response;

import java.math.BigDecimal;

public record BudgetAlertResponse(
        Long budgetId,
        String categoryName,
        BigDecimal budgetAmount,
        BigDecimal spentAmount,
        Double spentPercentage,
        Integer alertThreshold,
        String alertLevel,   // "WARNING" or "CRITICAL"
        String message
) {}