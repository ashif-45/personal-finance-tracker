package com.personalfinancetracker.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record ReportResponse(
        String period,
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal netSavings,
        List<MonthlyData> monthlyData,
        List<CategoryData> categoryData
) {
    public record MonthlyData(
            String month,        // "Jan", "Feb", etc.
            BigDecimal income,
            BigDecimal expense
    ) {}

    public record CategoryData(
            String categoryName,
            String color,
            BigDecimal totalAmount,
            Long transactionCount,
            Double percentage
    ) {}
}