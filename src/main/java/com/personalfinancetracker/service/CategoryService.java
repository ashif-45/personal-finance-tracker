package com.personalfinancetracker.service;

import com.personalfinancetracker.dto.request.CategoryRequest;
import com.personalfinancetracker.dto.response.CategoryResponse;
import com.personalfinancetracker.entity.Category;
import com.personalfinancetracker.entity.User;
import com.personalfinancetracker.entity.enums.TransactionType;
import com.personalfinancetracker.exception.BadRequestException;
import com.personalfinancetracker.exception.ResourceNotFoundException;
import com.personalfinancetracker.repository.CategoryRepository;
import com.personalfinancetracker.repository.TransactionRepository;
import com.personalfinancetracker.repository.UserRepository;
import com.personalfinancetracker.util.DtoMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           UserRepository userRepository,
                           TransactionRepository transactionRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories(String userEmail, TransactionType type) {
        User user = getUserByEmail(userEmail);
        List<Category> categories = (type != null)
                ? categoryRepository.findAllAvailableForUserAndType(user.getId(), type)
                : categoryRepository.findAllAvailableForUser(user.getId());

        return categories.stream().map(DtoMapper::toCategoryResponse).toList();
    }

    @Transactional
    public CategoryResponse createCategory(String userEmail, CategoryRequest request) {
        User user = getUserByEmail(userEmail);

        if (categoryRepository.existsByNameIgnoreCaseAndIsDefaultTrue(request.name()) ||
            categoryRepository.existsByNameIgnoreCaseAndUserId(request.name(), user.getId())) {
            throw new BadRequestException("A category with this name already exists");
        }

        Category category = new Category();
        category.setName(request.name().trim());
        category.setType(request.type());
        category.setIcon(request.icon() != null ? request.icon() : "Tag");
        category.setColor(request.color() != null ? request.color() : "#64748B");
        category.setUser(user);
        category.setIsDefault(false);

        Category saved = categoryRepository.save(category);
        return DtoMapper.toCategoryResponse(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(String userEmail, Long id, CategoryRequest request) {
        User user = getUserByEmail(userEmail);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (Boolean.TRUE.equals(category.getIsDefault())) {
            throw new BadRequestException("Default system categories cannot be modified");
        }

        if (!category.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to modify this category");
        }

        category.setName(request.name().trim());
        category.setType(request.type());
        if (request.icon() != null) category.setIcon(request.icon());
        if (request.color() != null) category.setColor(request.color());

        Category updated = categoryRepository.save(category);
        return DtoMapper.toCategoryResponse(updated);
    }

    @Transactional
    public void deleteCategory(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (Boolean.TRUE.equals(category.getIsDefault())) {
            throw new BadRequestException("Default system categories cannot be deleted");
        }

        if (!category.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You do not have permission to delete this category");
        }

        if (transactionRepository.existsByCategoryId(id)) {
            throw new BadRequestException("Cannot delete category as it is currently linked to existing transactions");
        }

        categoryRepository.delete(category);
    }
}