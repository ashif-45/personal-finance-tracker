package com.personalfinancetracker.controller;

import com.personalfinancetracker.dto.request.CategoryRequest;
import com.personalfinancetracker.dto.response.ApiResponse;
import com.personalfinancetracker.dto.response.CategoryResponse;
import com.personalfinancetracker.entity.enums.TransactionType;
import com.personalfinancetracker.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories(
            Authentication auth,
            @RequestParam(required = false) TransactionType type) {
        List<CategoryResponse> categories = categoryService.getCategories(auth.getName(), type);
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            Authentication auth,
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Category created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            Authentication auth,
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.updateCategory(auth.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            Authentication auth,
            @PathVariable Long id) {
        categoryService.deleteCategory(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}