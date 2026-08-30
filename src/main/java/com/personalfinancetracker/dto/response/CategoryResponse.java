package com.personalfinancetracker.dto.response;

import com.personalfinancetracker.entity.enums.TransactionType;

public record CategoryResponse(
        Long id,
        String name,
        TransactionType type,
        String icon,
        String color,
        Boolean isDefault
) {}