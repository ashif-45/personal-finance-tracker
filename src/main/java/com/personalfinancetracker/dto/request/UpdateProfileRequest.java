package com.personalfinancetracker.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
        String fullName,

        @Email(message = "Invalid email format")
        String email,

        @Size(max = 15, message = "Phone number must not exceed 15 characters")
        String phone,

        @Size(min = 3, max = 3, message = "Currency must be a 3-letter ISO code (e.g. INR, USD)")
        String currency
) {}