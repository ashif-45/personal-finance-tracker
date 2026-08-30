package com.personalfinancetracker.config;

import com.personalfinancetracker.entity.Category;
import com.personalfinancetracker.entity.enums.TransactionType;
import com.personalfinancetracker.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final CategoryRepository categoryRepository;

    public DataInitializer(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.countByIsDefaultTrue() == 0) {
            log.info("Seeding 12 default categories...");

            List<Category> defaultCategories = List.of(
                    // 3 INCOME Categories
                    new Category("Salary", TransactionType.INCOME, "Briefcase", "#10B981", null, true),
                    new Category("Freelance", TransactionType.INCOME, "Laptop", "#06B6D4", null, true),
                    new Category("Investment", TransactionType.INCOME, "TrendingUp", "#8B5CF6", null, true),

                    // 9 EXPENSE Categories
                    new Category("Food", TransactionType.EXPENSE, "Utensils", "#EF4444", null, true),
                    new Category("Transport", TransactionType.EXPENSE, "Car", "#F59E0B", null, true),
                    new Category("Shopping", TransactionType.EXPENSE, "ShoppingBag", "#EC4899", null, true),
                    new Category("Entertainment", TransactionType.EXPENSE, "Film", "#3B82F6", null, true),
                    new Category("Bills", TransactionType.EXPENSE, "Receipt", "#6366F1", null, true),
                    new Category("Healthcare", TransactionType.EXPENSE, "HeartPulse", "#14B8A6", null, true),
                    new Category("Education", TransactionType.EXPENSE, "GraduationCap", "#F97316", null, true),
                    new Category("Rent", TransactionType.EXPENSE, "Home", "#64748B", null, true),
                    new Category("Others", TransactionType.EXPENSE, "MoreHorizontal", "#94A3B8", null, true)
            );

            categoryRepository.saveAll(defaultCategories);
            log.info("Successfully seeded 12 default categories.");
        }
    }
}