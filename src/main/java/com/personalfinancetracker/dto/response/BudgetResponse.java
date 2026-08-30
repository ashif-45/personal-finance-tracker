package com.personalfinancetracker.dto.response;

import java.math.BigDecimal;

public record BudgetResponse(
        Long id,
        BigDecimal amount,
        Integer month,
        Integer year,
        CategoryResponse category,
        Integer alertThreshold,
        BigDecimal spent,          // total spent in this category for this month
        BigDecimal remaining,      // amount - spent
        Double spentPercentage     // (spent / amount) * 100
) {}