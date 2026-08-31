package com.personalfinancetracker.service;

import com.personalfinancetracker.dto.request.TransactionRequest;
import com.personalfinancetracker.dto.response.PageResponse;
import com.personalfinancetracker.dto.response.TransactionResponse;
import com.personalfinancetracker.entity.Category;
import com.personalfinancetracker.entity.Transaction;
import com.personalfinancetracker.entity.User;
import com.personalfinancetracker.entity.enums.TransactionType;
import com.personalfinancetracker.exception.BadRequestException;
import com.personalfinancetracker.exception.ResourceNotFoundException;
import com.personalfinancetracker.repository.CategoryRepository;
import com.personalfinancetracker.repository.TransactionRepository;
import com.personalfinancetracker.repository.UserRepository;
import com.personalfinancetracker.util.DtoMapper;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              CategoryRepository categoryRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private Category validateAndGetCategory(Long categoryId, Long userId, TransactionType expectedType) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

        if (!category.getIsDefault() && (category.getUser() == null || !category.getUser().getId().equals(userId))) {
            throw new BadRequestException("Invalid category selected");
        }

        if (expectedType != null && category.getType() != expectedType) {
            throw new BadRequestException("Category type (" + category.getType() + ") does not match transaction type (" + expectedType + ")");
        }

        return category;
    }

    @Transactional(readOnly = true)
    public PageResponse<TransactionResponse> getTransactions(
            String userEmail,
            LocalDate startDate,
            LocalDate endDate,
            Long categoryId,
            TransactionType type,
            String search,
            int page,
            int size,
            String sortBy,
            String sortDirection) {

        User user = getUserByEmail(userEmail);

        Sort sort = sortDirection.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        // Fix for negative size (ALL):
        // If size <= 0 (e.g. -1 for ALL), use Integer.MAX_VALUE and page 0
        int effectiveSize = (size <= 0) ? Integer.MAX_VALUE : size;
        int effectivePage = (size <= 0) ? 0 : page;

        Pageable pageable = PageRequest.of(effectivePage, effectiveSize, sort);

        Specification<Transaction> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user").get("id"), user.getId()));

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("transactionDate"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("transactionDate"), endDate));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (search != null && !search.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("description")), "%" + search.trim().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<TransactionResponse> mappedPage = transactionRepository.findAll(spec, pageable)
                .map(DtoMapper::toTransactionResponse);

        return PageResponse.from(mappedPage);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);
        Transaction transaction = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        return DtoMapper.toTransactionResponse(transaction);
    }

    @Transactional
    public TransactionResponse createTransaction(String userEmail, TransactionRequest req) {
        User user = getUserByEmail(userEmail);
        Category category = validateAndGetCategory(req.categoryId(), user.getId(), req.type());

        Transaction tx = new Transaction();
        tx.setAmount(req.amount());
        tx.setType(req.type());
        tx.setDescription(req.description());
        tx.setTransactionDate(req.transactionDate());
        tx.setCategory(category);
        tx.setUser(user);

        Transaction saved = transactionRepository.save(tx);
        return DtoMapper.toTransactionResponse(saved);
    }

    @Transactional
    public TransactionResponse updateTransaction(String userEmail, Long id, TransactionRequest req) {
        User user = getUserByEmail(userEmail);
        Transaction tx = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        Category category = validateAndGetCategory(req.categoryId(), user.getId(), req.type());

        tx.setAmount(req.amount());
        tx.setType(req.type());
        tx.setDescription(req.description());
        tx.setTransactionDate(req.transactionDate());
        tx.setCategory(category);

        Transaction updated = transactionRepository.save(tx);
        return DtoMapper.toTransactionResponse(updated);
    }

    @Transactional
    public void deleteTransaction(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);
        Transaction tx = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        transactionRepository.delete(tx);
    }
}