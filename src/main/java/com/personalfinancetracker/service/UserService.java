package com.personalfinancetracker.service;

import com.personalfinancetracker.dto.request.ChangePasswordRequest;
import com.personalfinancetracker.dto.request.UpdateProfileRequest;
import com.personalfinancetracker.dto.response.UserProfileResponse;
import com.personalfinancetracker.entity.User;
import com.personalfinancetracker.exception.BadRequestException;
import com.personalfinancetracker.exception.ResourceNotFoundException;
import com.personalfinancetracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String email) {
        User user = getUserByEmail(email);
        return toProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String currentEmail, UpdateProfileRequest req) {
        User user = getUserByEmail(currentEmail);

        if (req.fullName() != null && !req.fullName().isBlank()) {
            user.setFullName(req.fullName().trim());
        }

        if (req.email() != null && !req.email().isBlank()) {
            // Check if new email is already taken by another user
            if (!req.email().equalsIgnoreCase(currentEmail) &&
                userRepository.existsByEmail(req.email())) {
                throw new BadRequestException("Email is already taken by another user");
            }
            user.setEmail(req.email().trim().toLowerCase());
        }

        if (req.phone() != null) {
            user.setPhone(req.phone().trim().isEmpty() ? null : req.phone().trim());
        }

        if (req.currency() != null && !req.currency().isBlank()) {
            user.setCurrency(req.currency().toUpperCase());
        }

        User updated = userRepository.save(user);
        return toProfileResponse(updated);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest req) {
        User user = getUserByEmail(email);

        // Verify current password
        if (!passwordEncoder.matches(req.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        // Prevent same password
        if (passwordEncoder.matches(req.newPassword(), user.getPassword())) {
            throw new BadRequestException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
    }

    private UserProfileResponse toProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getCurrency(),
                user.getCreatedAt()
        );
    }
}