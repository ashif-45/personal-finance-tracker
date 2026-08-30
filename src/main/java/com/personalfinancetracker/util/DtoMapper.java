package com.personalfinancetracker.util;

import com.personalfinancetracker.dto.response.BudgetResponse;
import com.personalfinancetracker.dto.response.CategoryResponse;
import com.personalfinancetracker.dto.response.TransactionResponse;
import com.personalfinancetracker.entity.Budget;
import com.personalfinancetracker.entity.Category;
import com.personalfinancetracker.entity.Transaction;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class DtoMapper {

    private DtoMapper() {}

    public static CategoryResponse toCategoryResponse(Category category) {
        if (category == null) return null;
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType(),
                category.getIcon(),
                category.getColor(),
                category.getIsDefault()
        );
    }

    public static TransactionResponse toTransactionResponse(Transaction transaction) {
        if (transaction == null) return null;
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                toCategoryResponse(transaction.getCategory()),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt()
        );
    }

    public static BudgetResponse toBudgetResponse(Budget budget, BigDecimal spent) {
        if (budget == null) return null;

        BigDecimal remaining = budget.getAmount().subtract(spent);
        double spentPercentage = budget.getAmount().compareTo(BigDecimal.ZERO) > 0
                ? spent.multiply(BigDecimal.valueOf(100))
                    .divide(budget.getAmount(), 2, RoundingMode.HALF_UP)
                    .doubleValue()
                : 0.0;

        return new BudgetResponse(
                budget.getId(),
                budget.getAmount(),
                budget.getMonth(),
                budget.getYear(),
                toCategoryResponse(budget.getCategory()),
                budget.getAlertThreshold(),
                spent,
                remaining,
                spentPercentage
        );
    }
}