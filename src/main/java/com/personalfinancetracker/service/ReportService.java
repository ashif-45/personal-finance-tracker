package com.personalfinancetracker.service;

import com.personalfinancetracker.dto.response.ReportResponse;
import com.personalfinancetracker.dto.response.ReportResponse.CategoryData;
import com.personalfinancetracker.dto.response.ReportResponse.MonthlyData;
import com.personalfinancetracker.entity.User;
import com.personalfinancetracker.entity.enums.TransactionType;
import com.personalfinancetracker.exception.ResourceNotFoundException;
import com.personalfinancetracker.repository.TransactionRepository;
import com.personalfinancetracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
public class ReportService {

	private static final String[] MONTH_NAMES = { "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
			"Oct", "Nov", "Dec" };

	private final TransactionRepository transactionRepository;
	private final UserRepository userRepository;

	public ReportService(TransactionRepository transactionRepository, UserRepository userRepository) {
		this.transactionRepository = transactionRepository;
		this.userRepository = userRepository;
	}

	private User getUserByEmail(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
	}

	@Transactional(readOnly = true)
	public ReportResponse getMonthlyReport(String userEmail, int year) {
		User user = getUserByEmail(userEmail);
		Long userId = user.getId();

		List<Object[]> rows = transactionRepository.findMonthlyTotalsByUserIdAndYear(userId, year);

		// Build 12-month map
		Map<Integer, BigDecimal> incomeMap = new LinkedHashMap<>();
		Map<Integer, BigDecimal> expenseMap = new LinkedHashMap<>();
		for (int i = 1; i <= 12; i++) {
			incomeMap.put(i, BigDecimal.ZERO);
			expenseMap.put(i, BigDecimal.ZERO);
		}

		for (Object[] row : rows) {
			int month = ((Number) row[0]).intValue();
			TransactionType type = (TransactionType) row[1];
			BigDecimal amount = (BigDecimal) row[2];

			if (type == TransactionType.INCOME) {
				incomeMap.merge(month, amount, BigDecimal::add);
			} else {
				expenseMap.merge(month, amount, BigDecimal::add);
			}
		}

		BigDecimal totalIncome = BigDecimal.ZERO;
		BigDecimal totalExpenses = BigDecimal.ZERO;
		List<MonthlyData> monthlyData = new ArrayList<>();

		for (int i = 1; i <= 12; i++) {
			BigDecimal inc = incomeMap.get(i);
			BigDecimal exp = expenseMap.get(i);
			totalIncome = totalIncome.add(inc);
			totalExpenses = totalExpenses.add(exp);
			monthlyData.add(new MonthlyData(MONTH_NAMES[i], inc, exp));
		}

		// Category data for the full year
		LocalDate start = LocalDate.of(year, 1, 1);
		LocalDate end = LocalDate.of(year, 12, 31);
		List<CategoryData> categoryData = buildCategoryData(userId, start, end);

		return new ReportResponse(String.valueOf(year), totalIncome, totalExpenses, totalIncome.subtract(totalExpenses),
				monthlyData, categoryData);
	}

	@Transactional(readOnly = true)
	public ReportResponse getYearlyReport(String userEmail) {
		User user = getUserByEmail(userEmail);
		Long userId = user.getId();

		List<Object[]> rows = transactionRepository.findYearlyTotalsByUserId(userId);

		Map<Integer, BigDecimal> incomeMap = new LinkedHashMap<>();
		Map<Integer, BigDecimal> expenseMap = new LinkedHashMap<>();

		for (Object[] row : rows) {
			int year = ((Number) row[0]).intValue();
			TransactionType type = (TransactionType) row[1];
			BigDecimal amount = (BigDecimal) row[2];

			incomeMap.putIfAbsent(year, BigDecimal.ZERO);
			expenseMap.putIfAbsent(year, BigDecimal.ZERO);

			if (type == TransactionType.INCOME) {
				incomeMap.merge(year, amount, BigDecimal::add);
			} else {
				expenseMap.merge(year, amount, BigDecimal::add);
			}
		}

		BigDecimal totalIncome = BigDecimal.ZERO;
		BigDecimal totalExpenses = BigDecimal.ZERO;
		List<MonthlyData> yearlyData = new ArrayList<>();

		TreeSet<Integer> allYears = new TreeSet<>();
		allYears.addAll(incomeMap.keySet());
		allYears.addAll(expenseMap.keySet());

		for (int y : allYears) {
			BigDecimal inc = incomeMap.getOrDefault(y, BigDecimal.ZERO);
			BigDecimal exp = expenseMap.getOrDefault(y, BigDecimal.ZERO);
			totalIncome = totalIncome.add(inc);
			totalExpenses = totalExpenses.add(exp);
			yearlyData.add(new MonthlyData(String.valueOf(y), inc, exp));
		}

		return new ReportResponse("All Years", totalIncome, totalExpenses, totalIncome.subtract(totalExpenses),
				yearlyData, List.of());
	}

	@Transactional(readOnly = true)
	public ReportResponse getCategoryReport(String userEmail, int month, int year) {
		User user = getUserByEmail(userEmail);
		Long userId = user.getId();

		YearMonth ym = YearMonth.of(year, month);
		LocalDate start = ym.atDay(1);
		LocalDate end = ym.atEndOfMonth();

		List<CategoryData> categoryData = buildCategoryData(userId, start, end);

		BigDecimal totalExpenses = categoryData.stream().map(CategoryData::totalAmount).reduce(BigDecimal.ZERO,
				BigDecimal::add);

		BigDecimal totalIncome = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(userId,
				TransactionType.INCOME, start, end);

		return new ReportResponse(MONTH_NAMES[month] + " " + year, totalIncome, totalExpenses,
				totalIncome.subtract(totalExpenses), List.of(), categoryData);
	}

	private List<CategoryData> buildCategoryData(Long userId, LocalDate start, LocalDate end) {

		List<Object[]> rows = transactionRepository.findCategoryBreakdownByUserIdAndDateBetween(userId, start, end);

		// Only EXPENSE categories for breakdown
		BigDecimal totalExpenses = BigDecimal.ZERO;
		List<CategoryData> result = new ArrayList<>();

		for (Object[] row : rows) {
			TransactionType type = (TransactionType) row[2];

			if (type != TransactionType.EXPENSE) {
				continue;
			}

			String name = (String) row[0];
			String color = (String) row[1];
			BigDecimal amount = (BigDecimal) row[3];
			Long count = (Long) row[4];

			totalExpenses = totalExpenses.add(amount);

			result.add(new CategoryData(name, color, amount, count, 0.0));
		}

		// Make it effectively final for the lambda
		final BigDecimal finalTotalExpenses = totalExpenses;

		// Calculate percentages
		return result.stream().map(cd -> {
			double pct = finalTotalExpenses.compareTo(BigDecimal.ZERO) > 0 ? cd.totalAmount()
					.multiply(BigDecimal.valueOf(100)).divide(finalTotalExpenses, 1, RoundingMode.HALF_UP).doubleValue()
					: 0.0;

			return new CategoryData(cd.categoryName(), cd.color(), cd.totalAmount(), cd.transactionCount(), pct);
		}).toList();
	}

}