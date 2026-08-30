package com.personalfinancetracker.dto.response;

import java.time.LocalDateTime;

public record UserProfileResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String avatarUrl,
        String currency,
        LocalDateTime createdAt
) {}