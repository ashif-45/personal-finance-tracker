package com.personalfinancetracker.util;

import com.personalfinancetracker.dto.response.CategoryResponse;
import com.personalfinancetracker.dto.response.TransactionResponse;
import com.personalfinancetracker.entity.Category;
import com.personalfinancetracker.entity.Transaction;

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
}