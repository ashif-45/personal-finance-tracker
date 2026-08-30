package com.personalfinancetracker.repository;

import com.personalfinancetracker.entity.Category;
import com.personalfinancetracker.entity.User;
import com.personalfinancetracker.entity.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.isDefault = true OR c.user.id = :userId ORDER BY c.name ASC")
    List<Category> findAllAvailableForUser(@Param("userId") Long userId);

    @Query("SELECT c FROM Category c WHERE (c.isDefault = true OR c.user.id = :userId) AND c.type = :type ORDER BY c.name ASC")
    List<Category> findAllAvailableForUserAndType(@Param("userId") Long userId, @Param("type") TransactionType type);

    Optional<Category> findByIdAndUserId(Long id, Long userId);

    boolean existsByNameIgnoreCaseAndUserId(String name, Long userId);

    boolean existsByNameIgnoreCaseAndIsDefaultTrue(String name);

    long countByIsDefaultTrue();
}