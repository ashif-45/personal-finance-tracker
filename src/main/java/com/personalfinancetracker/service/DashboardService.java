package com.personalfinancetracker.service;

import com.personalfinancetracker.dto.response.DashboardResponse;
import com.personalfinancetracker.dto.response.DashboardResponse.CategorySpending;
import com.personalfinancetracker.dto.response.DashboardResponse.DailySpending;
import com.personalfinancetracker.dto.response.TransactionResponse;
import com.personalfinancetracker.entity.Transaction;
import com.personalfinancetracker.entity.User;
import com.personalfinancetracker.entity.enums.TransactionType;
import com.personalfinancetracker.exception.ResourceNotFoundException;
import com.personalfinancetracker.repository.TransactionRepository;
import com.personalfinancetracker.repository.UserRepository;
import com.personalfinancetracker.util.DtoMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public DashboardService(TransactionRepository transactionRepository,
                            UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @Transactional(readOnly = true)
    public DashboardResponse getSummary(String userEmail, LocalDate startDate, LocalDate endDate) {
        User user = getUserByEmail(userEmail);
        Long userId = user.getId();

        // If dates are null, default to current month
        if (startDate == null || endDate == null) {
            YearMonth currentMonth = YearMonth.now();
            startDate = currentMonth.atDay(1);
            endDate = currentMonth.atEndOfMonth();
        }

        // Totals
        BigDecimal totalIncome = transactionRepository
                .sumAmountByUserIdAndTypeAndDateBetween(userId, TransactionType.INCOME, startDate, endDate);
        BigDecimal totalExpenses = transactionRepository
                .sumAmountByUserIdAndTypeAndDateBetween(userId, TransactionType.EXPENSE, startDate, endDate);
        BigDecimal balance = totalIncome.subtract(totalExpenses);

        Double savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0
                ? balance.multiply(BigDecimal.valueOf(100))
                    .divide(totalIncome, 2, RoundingMode.HALF_UP)
                    .doubleValue()
                : 0.0;

        Long txCount = transactionRepository.countByUserIdAndDateBetween(userId, startDate, endDate);

        // Recent transactions (last 5 within the selected date range)
        List<Transaction> recent = transactionRepository
                .findTop5ByUserIdAndDateBetweenOrderByTransactionDateDesc(userId, startDate, endDate, PageRequest.of(0, 5));
        
        List<TransactionResponse> recentDtos = recent.stream()
                .map(DtoMapper::toTransactionResponse)
                .toList();

        // Category breakdown (expenses only, for selected period)
        List<Object[]> catRows = transactionRepository
                .findCategorySpendingByUserIdAndDateBetween(userId, startDate, endDate);

        BigDecimal totalCatSpending = catRows.stream()
                .map(row -> (BigDecimal) row[2])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CategorySpending> categoryBreakdown = catRows.stream()
                .map(row -> {
                    String name = (String) row[0];
                    String color = (String) row[1];
                    BigDecimal amount = (BigDecimal) row[2];
                    double pct = totalCatSpending.compareTo(BigDecimal.ZERO) > 0
                            ? amount.multiply(BigDecimal.valueOf(100))
                                .divide(totalCatSpending, 1, RoundingMode.HALF_UP)
                                .doubleValue()
                            : 0.0;
                    return new CategorySpending(name, color, amount, pct);
                })
                .toList();

        // Daily trend
        List<Object[]> dailyRows = transactionRepository
                .findDailyTotalsByUserIdAndDateBetween(userId, startDate, endDate);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM");

        Map<LocalDate, DailySpending> dailyMap = new LinkedHashMap<>();
        for (Object[] row : dailyRows) {
            LocalDate date = (LocalDate) row[0];
            TransactionType type = (TransactionType) row[1];
            BigDecimal amount = (BigDecimal) row[2];

            dailyMap.computeIfAbsent(date, d ->
                    new DailySpending(d.format(fmt), BigDecimal.ZERO, BigDecimal.ZERO));

            DailySpending existing = dailyMap.get(date);
            if (type == TransactionType.INCOME) {
                dailyMap.put(date, new DailySpending(existing.date(), existing.income().add(amount), existing.expense()));
            } else {
                dailyMap.put(date, new DailySpending(existing.date(), existing.income(), existing.expense().add(amount)));
            }
        }

        return new DashboardResponse(
                totalIncome, totalExpenses, balance, savingsRate,
                txCount, recentDtos, categoryBreakdown,
                new ArrayList<>(dailyMap.values())
        );
    }
}