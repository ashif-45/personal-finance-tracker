package com.personalfinancetracker.dto.response;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long userId,
        String fullName,
        String email
) {
    public AuthResponse(String accessToken, String refreshToken,
                        Long userId, String fullName, String email) {
        this(accessToken, refreshToken, "Bearer", userId, fullName, email);
    }
}