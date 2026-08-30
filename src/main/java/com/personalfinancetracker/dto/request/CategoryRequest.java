package com.personalfinancetracker.dto.request;

import com.personalfinancetracker.entity.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "Category name is required")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        String name,

        @NotNull(message = "Transaction type is required (INCOME or EXPENSE)")
        TransactionType type,

        @Size(max = 50, message = "Icon name cannot exceed 50 characters")
        String icon,

        @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "Color must be a valid 6-character hex code (e.g. #FF5733)")
        String color
) {}