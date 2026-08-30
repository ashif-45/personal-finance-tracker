package com.personalfinancetracker.controller;

import com.personalfinancetracker.dto.request.LoginRequest;
import com.personalfinancetracker.dto.request.RegisterRequest;
import com.personalfinancetracker.dto.response.ApiResponse;
import com.personalfinancetracker.dto.response.AuthResponse;
import com.personalfinancetracker.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(
                ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        AuthResponse response = authService.refresh(refreshToken);
        return ResponseEntity.ok(
                ApiResponse.success("Token refreshed", response));
    }
}