package com.personalfinancetracker.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.personalfinancetracker.dto.request.BudgetRequest;
import com.personalfinancetracker.dto.request.CategoryRequest;
import com.personalfinancetracker.dto.request.TransactionRequest;
import com.personalfinancetracker.dto.response.BulkUploadResponse;
import com.personalfinancetracker.dto.response.BulkUploadResponse.RowError;
import com.personalfinancetracker.entity.Category;
import com.personalfinancetracker.entity.User;
import com.personalfinancetracker.entity.enums.TransactionType;
import com.personalfinancetracker.exception.ResourceNotFoundException;
import com.personalfinancetracker.repository.CategoryRepository;
import com.personalfinancetracker.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CsvImportService {

    private static final Logger log =
            LoggerFactory.getLogger(CsvImportService.class);

    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionService transactionService;
    private final BudgetService budgetService;
    private final CategoryService categoryService;

    public CsvImportService(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            TransactionService transactionService,
            BudgetService budgetService,
            CategoryService categoryService) {

        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.transactionService = transactionService;
        this.budgetService = budgetService;
        this.categoryService = categoryService;
    }

    // ============================================================
    // GET USER
    // ============================================================

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    // ============================================================
    // TRANSACTIONS BULK UPLOAD
    // ============================================================
    //
    // Expected CSV:
    //
    // amount,type,categoryName,transactionDate,description
    //
    // Example:
    // 500.00,EXPENSE,Food,2025-01-15,Lunch at restaurant
    //
    // ============================================================

    @Transactional
    public BulkUploadResponse importTransactions(
            String userEmail,
            MultipartFile file) {

        User user = getUser(userEmail);

        List<String[]> rows = parseCsv(file);

        List<RowError> errors = new ArrayList<>();
        int successCount = 0;

        // Empty CSV
        if (rows.isEmpty()) {
            return new BulkUploadResponse(
                    0,
                    0,
                    0,
                    List.of()
            );
        }

        // --------------------------------------------------------
        // Load all categories for the user
        // --------------------------------------------------------

        List<Category> allCats =
                categoryRepository.findAllAvailableForUser(user.getId());

        Map<String, Category> catMap =
                allCats.stream()
                        .collect(Collectors.toMap(
                                c -> c.getName()
                                        .toLowerCase()
                                        .trim(),
                                c -> c,
                                (a, b) -> a
                        ));

        // --------------------------------------------------------
        // Skip header row if present
        // --------------------------------------------------------

        int startIndex =
                isHeaderRow(rows.get(0)) ? 1 : 0;

        // --------------------------------------------------------
        // Process rows
        // --------------------------------------------------------

        for (int i = startIndex; i < rows.size(); i++) {

            int rowNum = i + 1;

            String[] cols = rows.get(i);

            try {

                // ------------------------------------------------
                // Validate columns
                // ------------------------------------------------

                if (cols.length < 4) {

                    errors.add(
                            new RowError(
                                    rowNum,
                                    "Insufficient columns. Need: " +
                                    "amount,type,categoryName," +
                                    "transactionDate[,description]"
                            )
                    );

                    continue;
                }

                // ------------------------------------------------
                // Amount
                // ------------------------------------------------

                BigDecimal amount =
                        new BigDecimal(cols[0].trim());

                // ------------------------------------------------
                // Transaction type
                // ------------------------------------------------

                TransactionType type =
                        TransactionType.valueOf(
                                cols[1].trim().toUpperCase()
                        );

                // ------------------------------------------------
                // Category name
                // ------------------------------------------------

                String catName =
                        cols[2].trim().toLowerCase();

                // ------------------------------------------------
                // Date
                // ------------------------------------------------

                LocalDate date =
                        LocalDate.parse(
                                cols[3].trim(),
                                DATE_FMT
                        );

                // ------------------------------------------------
                // Description
                // ------------------------------------------------

                String description =
                        cols.length > 4
                                ? cols[4].trim()
                                : "";

                // ------------------------------------------------
                // Find category
                // ------------------------------------------------

                Category category = catMap.get(catName);

                if (category == null) {

                    errors.add(
                            new RowError(
                                    rowNum,
                                    "Category '" +
                                    cols[2].trim() +
                                    "' not found. Create it first."
                            )
                    );

                    continue;
                }

                // ------------------------------------------------
                // Validate category type
                // ------------------------------------------------

                if (category.getType() != type) {

                    errors.add(
                            new RowError(
                                    rowNum,
                                    "Category '" +
                                    category.getName() +
                                    "' is " +
                                    category.getType() +
                                    " but transaction type is " +
                                    type
                            )
                    );

                    continue;
                }

                // ------------------------------------------------
                // Create transaction request
                // ------------------------------------------------

                TransactionRequest request =
                        new TransactionRequest(
                                amount,
                                type,
                                description,
                                date,
                                category.getId()
                        );

                // ------------------------------------------------
                // Save transaction
                // ------------------------------------------------

                transactionService.createTransaction(
                        userEmail,
                        request
                );

                successCount++;

            } catch (NumberFormatException e) {

                errors.add(
                        new RowError(
                                rowNum,
                                "Invalid amount: '" +
                                (cols.length > 0
                                        ? cols[0].trim()
                                        : "") +
                                "'"
                        )
                );

            } catch (DateTimeParseException e) {

                errors.add(
                        new RowError(
                                rowNum,
                                "Invalid date: '" +
                                (cols.length > 3
                                        ? cols[3].trim()
                                        : "") +
                                "'. Use yyyy-MM-dd format."
                        )
                );

            } catch (IllegalArgumentException e) {

                errors.add(
                        new RowError(
                                rowNum,
                                "Invalid type: '" +
                                (cols.length > 1
                                        ? cols[1].trim()
                                        : "") +
                                "'. Use INCOME or EXPENSE."
                        )
                );

            } catch (Exception e) {

                log.error(
                        "Error processing transaction CSV row {}",
                        rowNum,
                        e
                );

                errors.add(
                        new RowError(
                                rowNum,
                                e.getMessage() != null
                                        ? e.getMessage()
                                        : "Unknown error"
                        )
                );
            }
        }

        // --------------------------------------------------------
        // Return response
        // --------------------------------------------------------

        return new BulkUploadResponse(
                rows.size() - startIndex,
                successCount,
                errors.size(),
                errors
        );
    }

    // ============================================================
    // BUDGETS BULK UPLOAD
    // ============================================================
    //
    // Expected CSV:
    //
    // amount,month,year,categoryName,alertThreshold
    //
    // Example:
    //
    // 5000,1,2025,Food,80
    // 10000,1,2025,,90
    //
    // Empty categoryName = overall budget
    //
    // ============================================================

    @Transactional
    public BulkUploadResponse importBudgets(
            String userEmail,
            MultipartFile file) {

        User user = getUser(userEmail);

        List<String[]> rows = parseCsv(file);

        List<RowError> errors = new ArrayList<>();
        int successCount = 0;

        // Empty CSV
        if (rows.isEmpty()) {

            return new BulkUploadResponse(
                    0,
                    0,
                    0,
                    List.of()
            );
        }

        // --------------------------------------------------------
        // Load categories
        // --------------------------------------------------------

        List<Category> allCats =
                categoryRepository.findAllAvailableForUser(user.getId());

        Map<String, Category> catMap =
                allCats.stream()
                        .collect(Collectors.toMap(
                                c -> c.getName()
                                        .toLowerCase()
                                        .trim(),
                                c -> c,
                                (a, b) -> a
                        ));

        // --------------------------------------------------------
        // Skip header
        // --------------------------------------------------------

        int startIndex =
                isHeaderRow(rows.get(0)) ? 1 : 0;

        // --------------------------------------------------------
        // Process rows
        // --------------------------------------------------------

        for (int i = startIndex; i < rows.size(); i++) {

            int rowNum = i + 1;

            String[] cols = rows.get(i);

            try {

                // ------------------------------------------------
                // Validate columns
                // ------------------------------------------------

                if (cols.length < 3) {

                    errors.add(
                            new RowError(
                                    rowNum,
                                    "Insufficient columns. Need: " +
                                    "amount,month,year[,categoryName,alertThreshold]"
                            )
                    );

                    continue;
                }

                // ------------------------------------------------
                // Amount
                // ------------------------------------------------

                BigDecimal amount =
                        new BigDecimal(cols[0].trim());

                // ------------------------------------------------
                // Month
                // ------------------------------------------------

                int month =
                        Integer.parseInt(cols[1].trim());

                // ------------------------------------------------
                // Year
                // ------------------------------------------------

                int year =
                        Integer.parseInt(cols[2].trim());

                // ------------------------------------------------
                // Category
                // ------------------------------------------------

                String catName =
                        cols.length > 3
                                ? cols[3].trim()
                                : "";

                // ------------------------------------------------
                // Alert threshold
                // Default = 80
                // ------------------------------------------------

                int threshold =
                        cols.length > 4 &&
                        !cols[4].trim().isEmpty()
                                ? Integer.parseInt(
                                        cols[4].trim()
                                )
                                : 80;

                // ------------------------------------------------
                // Validate month
                // ------------------------------------------------

                if (month < 1 || month > 12) {

                    errors.add(
                            new RowError(
                                    rowNum,
                                    "Invalid month: " +
                                    month +
                                    ". Month must be between 1 and 12."
                            )
                    );

                    continue;
                }

                // ------------------------------------------------
                // Validate alert threshold
                // ------------------------------------------------

                if (threshold < 0 || threshold > 100) {

                    errors.add(
                            new RowError(
                                    rowNum,
                                    "Invalid alert threshold: " +
                                    threshold +
                                    ". Must be between 0 and 100."
                            )
                    );

                    continue;
                }

                // ------------------------------------------------
                // Category ID
                // ------------------------------------------------

                Long categoryId = null;

                if (!catName.isEmpty()) {

                    Category category =
                            catMap.get(
                                    catName.toLowerCase()
                            );

                    if (category == null) {

                        errors.add(
                                new RowError(
                                        rowNum,
                                        "Category '" +
                                        catName +
                                        "' not found."
                                )
                        );

                        continue;
                    }

                    categoryId =
                            category.getId();
                }

                // ------------------------------------------------
                // Create budget request
                // ------------------------------------------------

                BudgetRequest request =
                        new BudgetRequest(
                                amount,
                                month,
                                year,
                                categoryId,
                                threshold
                        );

                // ------------------------------------------------
                // Save budget
                // ------------------------------------------------

                budgetService.createBudget(
                        userEmail,
                        request
                );

                successCount++;

            } catch (NumberFormatException e) {

                errors.add(
                        new RowError(
                                rowNum,
                                "Invalid number format in row."
                        )
                );

            } catch (Exception e) {

                log.error(
                        "Error processing budget CSV row {}",
                        rowNum,
                        e
                );

                errors.add(
                        new RowError(
                                rowNum,
                                e.getMessage() != null
                                        ? e.getMessage()
                                        : "Unknown error"
                        )
                );
            }
        }

        // --------------------------------------------------------
        // Return response
        // --------------------------------------------------------

        return new BulkUploadResponse(
                rows.size() - startIndex,
                successCount,
                errors.size(),
                errors
        );
    }

    // ============================================================
    // CATEGORIES BULK UPLOAD
    // ============================================================
    //
    // Expected CSV:
    //
    // name,type,icon,color
    //
    // Example:
    //
    // Groceries,EXPENSE,ShoppingCart,#EF4444
    //
    // ============================================================

    @Transactional
    public BulkUploadResponse importCategories(
            String userEmail,
            MultipartFile file) {

        List<String[]> rows = parseCsv(file);

        List<RowError> errors = new ArrayList<>();
        int successCount = 0;

        // Empty CSV
        if (rows.isEmpty()) {

            return new BulkUploadResponse(
                    0,
                    0,
                    0,
                    List.of()
            );
        }

        // --------------------------------------------------------
        // Skip header
        // --------------------------------------------------------

        int startIndex =
                isHeaderRow(rows.get(0)) ? 1 : 0;

        // --------------------------------------------------------
        // Process rows
        // --------------------------------------------------------

        for (int i = startIndex; i < rows.size(); i++) {

            int rowNum = i + 1;

            String[] cols = rows.get(i);

            try {

                // ------------------------------------------------
                // Validate columns
                // ------------------------------------------------

                if (cols.length < 2) {

                    errors.add(
                            new RowError(
                                    rowNum,
                                    "Insufficient columns. Need: " +
                                    "name,type[,icon,color]"
                            )
                    );

                    continue;
                }

                // ------------------------------------------------
                // Name
                // ------------------------------------------------

                String name =
                        cols[0].trim();

                if (name.isEmpty()) {

                    errors.add(
                            new RowError(
                                    rowNum,
                                    "Category name cannot be empty."
                            )
                    );

                    continue;
                }

                // ------------------------------------------------
                // Type
                // ------------------------------------------------

                TransactionType type =
                        TransactionType.valueOf(
                                cols[1]
                                        .trim()
                                        .toUpperCase()
                        );

                // ------------------------------------------------
                // Icon
                // ------------------------------------------------

                String icon =
                        cols.length > 2 &&
                        !cols[2].trim().isEmpty()
                                ? cols[2].trim()
                                : "Tag";

                // ------------------------------------------------
                // Color
                // ------------------------------------------------

                String color =
                        cols.length > 3 &&
                        !cols[3].trim().isEmpty()
                                ? cols[3].trim()
                                : "#64748B";

                // ------------------------------------------------
                // Create request
                // ------------------------------------------------

                CategoryRequest request =
                        new CategoryRequest(
                                name,
                                type,
                                icon,
                                color
                        );

                // ------------------------------------------------
                // Save category
                // ------------------------------------------------

                categoryService.createCategory(
                        userEmail,
                        request
                );

                successCount++;

            } catch (IllegalArgumentException e) {

                errors.add(
                        new RowError(
                                rowNum,
                                "Invalid type: '" +
                                (cols.length > 1
                                        ? cols[1].trim()
                                        : "") +
                                "'. Use INCOME or EXPENSE."
                        )
                );

            } catch (Exception e) {

                log.error(
                        "Error processing category CSV row {}",
                        rowNum,
                        e
                );

                errors.add(
                        new RowError(
                                rowNum,
                                e.getMessage() != null
                                        ? e.getMessage()
                                        : "Unknown error"
                        )
                );
            }
        }

        // --------------------------------------------------------
        // Return response
        // --------------------------------------------------------

        return new BulkUploadResponse(
                rows.size() - startIndex,
                successCount,
                errors.size(),
                errors
        );
    }

    // ============================================================
    // CSV PARSER
    // ============================================================

    private List<String[]> parseCsv(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new RuntimeException(
                    "CSV file is empty or not provided."
            );
        }

        try (
                Reader reader =
                        new InputStreamReader(
                                file.getInputStream(),
                                StandardCharsets.UTF_8
                        );

                CSVReader csvReader =
                        new CSVReader(reader)
        ) {

            return csvReader.readAll();

        } catch (CsvException e) {

            // CsvException is specifically a CSV parsing error
            log.error(
                    "CSV parsing error: {}",
                    e.getMessage(),
                    e
            );

            throw new RuntimeException(
                    "Invalid CSV format: " +
                    e.getMessage(),
                    e
            );

        } catch (Exception e) {

            // Handles IOException and other file-reading errors
            log.error(
                    "Failed to read CSV file: {}",
                    e.getMessage(),
                    e
            );

            throw new RuntimeException(
                    "Failed to read CSV file: " +
                    e.getMessage(),
                    e
            );
        }
    }

    // ============================================================
    // HEADER DETECTION
    // ============================================================

    private boolean isHeaderRow(String[] row) {

        if (row == null || row.length == 0) {
            return false;
        }

        String first =
                row[0]
                        .trim()
                        .toLowerCase();

        return first.equals("amount")
                || first.equals("name")
                || first.equals("date");
    }
}
