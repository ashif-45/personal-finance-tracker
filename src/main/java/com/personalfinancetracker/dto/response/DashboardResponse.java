package com.personalfinancetracker.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal balance,
        Double savingsRate,       // percentage: (income - expenses) / income * 100
        Long transactionCount,
        List<TransactionResponse> recentTransactions,
        List<CategorySpending> categoryBreakdown,
        List<DailySpending> dailyTrend
) {
    public record CategorySpending(
            String categoryName,
            String color,
            BigDecimal amount,
            Double percentage
    ) {}

    public record DailySpending(
            String date,       // "DD MMM"
            BigDecimal income,
            BigDecimal expense
    ) {}
}