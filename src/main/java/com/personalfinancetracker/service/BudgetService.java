package com.personalfinancetracker.service;

import com.personalfinancetracker.dto.request.BudgetRequest;
import com.personalfinancetracker.dto.response.BudgetAlertResponse;
import com.personalfinancetracker.dto.response.BudgetResponse;
import com.personalfinancetracker.entity.Budget;
import com.personalfinancetracker.entity.Category;
import com.personalfinancetracker.entity.User;
import com.personalfinancetracker.entity.enums.TransactionType;
import com.personalfinancetracker.exception.BadRequestException;
import com.personalfinancetracker.exception.ResourceNotFoundException;
import com.personalfinancetracker.repository.BudgetRepository;
import com.personalfinancetracker.repository.CategoryRepository;
import com.personalfinancetracker.repository.TransactionRepository;
import com.personalfinancetracker.repository.UserRepository;
import com.personalfinancetracker.util.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(BudgetRepository budgetRepository,
                         UserRepository userRepository,
                         CategoryRepository categoryRepository,
                         TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    /**
     * Calculate total EXPENSE spending for a category in a given month/year.
     */
    private BigDecimal calculateSpent(Long userId, Long categoryId, int month, int year) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        if (categoryId != null) {
            return transactionRepository.sumAmountByUserIdAndCategoryIdAndTypeAndDateBetween(
                    userId, categoryId, TransactionType.EXPENSE, start, end
            );
        } else {
            return transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                    userId, TransactionType.EXPENSE, start, end
            );
        }
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getAllBudgets(String userEmail) {
        User user = getUserByEmail(userEmail);
        List<Budget> budgets = budgetRepository.findAllByUserId(user.getId());

        return budgets.stream().map(b -> {
            Long catId = b.getCategory() != null ? b.getCategory().getId() : null;
            BigDecimal spent = calculateSpent(user.getId(), catId, b.getMonth(), b.getYear());
            return DtoMapper.toBudgetResponse(b, spent);
        }).toList();
    }

    /**
     * Get budgets for a specific month and year.
     * If month or year is null, defaults to the current month/year.
     */
    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgetsByPeriod(String userEmail, Integer month, Integer year) {
        User user = getUserByEmail(userEmail);
        LocalDate now = LocalDate.now();

        int targetMonth = (month != null && month >= 1 && month <= 12)
                ? month
                : now.getMonthValue();
        int targetYear = (year != null && year >= 2020 && year <= 2100)
                ? year
                : now.getYear();

        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(
                user.getId(), targetMonth, targetYear
        );

        return budgets.stream().map(b -> {
            Long catId = b.getCategory() != null ? b.getCategory().getId() : null;
            BigDecimal spent = calculateSpent(user.getId(), catId, b.getMonth(), b.getYear());
            return DtoMapper.toBudgetResponse(b, spent);
        }).toList();
    }

    // Keep getCurrentMonthBudgets as a thin wrapper if other code still calls it
    @Transactional(readOnly = true)
    public List<BudgetResponse> getCurrentMonthBudgets(String userEmail) {
        return getBudgetsByPeriod(userEmail, null, null);
    }

    @Transactional
    public BudgetResponse createBudget(String userEmail, BudgetRequest req) {
        User user = getUserByEmail(userEmail);

        // Validate category if provided
        Category category = null;
        if (req.categoryId() != null) {
            category = categoryRepository.findById(req.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + req.categoryId()));

            if (category.getType() != TransactionType.EXPENSE) {
                throw new BadRequestException("Budgets can only be set for EXPENSE categories");
            }

            // Check for duplicate budget
            if (budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(
                    user.getId(), req.categoryId(), req.month(), req.year())) {
                throw new BadRequestException(
                        "A budget already exists for '" + category.getName() + "' in " +
                        req.month() + "/" + req.year()
                );
            }
        }

        Budget budget = new Budget();
        budget.setAmount(req.amount());
        budget.setMonth(req.month());
        budget.setYear(req.year());
        budget.setCategory(category);
        budget.setUser(user);
        budget.setAlertThreshold(req.alertThreshold() != null ? req.alertThreshold() : 80);

        Budget saved = budgetRepository.save(budget);

        Long catId = saved.getCategory() != null ? saved.getCategory().getId() : null;
        BigDecimal spent = calculateSpent(user.getId(), catId, saved.getMonth(), saved.getYear());
        return DtoMapper.toBudgetResponse(saved, spent);
    }

    @Transactional
    public BudgetResponse updateBudget(String userEmail, Long id, BudgetRequest req) {
        User user = getUserByEmail(userEmail);
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));

        Category category = null;
        if (req.categoryId() != null) {
            category = categoryRepository.findById(req.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

            if (category.getType() != TransactionType.EXPENSE) {
                throw new BadRequestException("Budgets can only be set for EXPENSE categories");
            }
        }

        budget.setAmount(req.amount());
        budget.setMonth(req.month());
        budget.setYear(req.year());
        budget.setCategory(category);
        if (req.alertThreshold() != null) {
            budget.setAlertThreshold(req.alertThreshold());
        }

        Budget updated = budgetRepository.save(budget);

        Long catId = updated.getCategory() != null ? updated.getCategory().getId() : null;
        BigDecimal spent = calculateSpent(user.getId(), catId, updated.getMonth(), updated.getYear());
        return DtoMapper.toBudgetResponse(updated, spent);
    }

    @Transactional
    public void deleteBudget(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);
        Budget budget = budgetRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
        budgetRepository.delete(budget);
    }

    /**
     * Check all current-month budgets and return alerts for those
     * where spending has reached or exceeded the alert threshold.
     */
    @Transactional(readOnly = true)
    public List<BudgetAlertResponse> getBudgetAlerts(String userEmail) {
        User user = getUserByEmail(userEmail);
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(
                user.getId(), currentMonth, currentYear
        );

        List<BudgetAlertResponse> alerts = new ArrayList<>();

        for (Budget b : budgets) {
            Long catId = b.getCategory() != null ? b.getCategory().getId() : null;
            BigDecimal spent = calculateSpent(user.getId(), catId, currentMonth, currentYear);

            if (b.getAmount().compareTo(BigDecimal.ZERO) <= 0) continue;

            double spentPct = spent.multiply(BigDecimal.valueOf(100))
                    .divide(b.getAmount(), 2, RoundingMode.HALF_UP)
                    .doubleValue();

            String catName = b.getCategory() != null ? b.getCategory().getName() : "Overall";

            if (spentPct >= 100) {
                alerts.add(new BudgetAlertResponse(
                        b.getId(),
                        catName,
                        b.getAmount(),
                        spent,
                        spentPct,
                        b.getAlertThreshold(),
                        "CRITICAL",
                        String.format("You have exceeded your '%s' budget by %.0f%%!", catName, spentPct - 100)
                ));
            } else if (spentPct >= b.getAlertThreshold()) {
                alerts.add(new BudgetAlertResponse(
                        b.getId(),
                        catName,
                        b.getAmount(),
                        spent,
                        spentPct,
                        b.getAlertThreshold(),
                        "WARNING",
                        String.format("You've used %.0f%% of your '%s' budget (threshold: %d%%).", spentPct, catName, b.getAlertThreshold())
                ));
            }
        }

        return alerts;
    }
}