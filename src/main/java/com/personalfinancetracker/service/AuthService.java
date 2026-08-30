package com.personalfinancetracker.service;

import com.personalfinancetracker.dto.request.LoginRequest;
import com.personalfinancetracker.dto.request.RegisterRequest;
import com.personalfinancetracker.dto.response.AuthResponse;
import com.personalfinancetracker.entity.User;
import com.personalfinancetracker.exception.BadRequestException;
import com.personalfinancetracker.repository.UserRepository;
import com.personalfinancetracker.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setCurrency("INR");

        User saved = userRepository.save(user);

        String accessToken = tokenProvider.generateAccessToken(saved.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(saved.getEmail());

        return new AuthResponse(
                accessToken, refreshToken,
                saved.getId(), saved.getFullName(), saved.getEmail()
        );
    }

    public AuthResponse login(LoginRequest req) {
        // This will throw BadCredentialsException if invalid
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String accessToken = tokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        return new AuthResponse(
                accessToken, refreshToken,
                user.getId(), user.getFullName(), user.getEmail()
        );
    }

    public AuthResponse refresh(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }
        String email = tokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String newAccess = tokenProvider.generateAccessToken(email);
        String newRefresh = tokenProvider.generateRefreshToken(email);

        return new AuthResponse(
                newAccess, newRefresh,
                user.getId(), user.getFullName(), user.getEmail()
        );
    }
}