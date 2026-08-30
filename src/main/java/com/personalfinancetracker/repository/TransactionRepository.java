package com.personalfinancetracker.repository;

import com.personalfinancetracker.entity.Transaction;
import com.personalfinancetracker.entity.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    boolean existsByCategoryId(Long categoryId);

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId ORDER BY t.transactionDate DESC, t.createdAt DESC")
    Page<Transaction> findAllByUserId(@Param("userId") Long userId, Pageable pageable);

    // --- Budget spending queries ---

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
          AND t.category.id = :categoryId
          AND t.type = :type
          AND t.transactionDate BETWEEN :startDate AND :endDate
    """)
    BigDecimal sumAmountByUserIdAndCategoryIdAndTypeAndDateBetween(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
          AND t.type = :type
          AND t.transactionDate BETWEEN :startDate AND :endDate
    """)
    BigDecimal sumAmountByUserIdAndTypeAndDateBetween(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // --- Dashboard queries ---

    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId ORDER BY t.transactionDate DESC, t.createdAt DESC")
    List<Transaction> findTop5ByUserIdOrderByTransactionDateDesc(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = :userId AND t.transactionDate BETWEEN :start AND :end")
    Long countByUserIdAndDateBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    // Category-wise spending for a date range
    @Query("""
        SELECT t.category.name, t.category.color, SUM(t.amount)
        FROM Transaction t
        WHERE t.user.id = :userId
          AND t.type = 'EXPENSE'
          AND t.transactionDate BETWEEN :start AND :end
        GROUP BY t.category.id, t.category.name, t.category.color
        ORDER BY SUM(t.amount) DESC
    """)
    List<Object[]> findCategorySpendingByUserIdAndDateBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    // Daily income/expense for a date range
    @Query("""
        SELECT t.transactionDate, t.type, SUM(t.amount)
        FROM Transaction t
        WHERE t.user.id = :userId
          AND t.transactionDate BETWEEN :start AND :end
        GROUP BY t.transactionDate, t.type
        ORDER BY t.transactionDate ASC
    """)
    List<Object[]> findDailyTotalsByUserIdAndDateBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    // --- Report queries ---

    // Monthly income/expense for a given year
    @Query("""
        SELECT MONTH(t.transactionDate), t.type, SUM(t.amount)
        FROM Transaction t
        WHERE t.user.id = :userId
          AND YEAR(t.transactionDate) = :year
        GROUP BY MONTH(t.transactionDate), t.type
        ORDER BY MONTH(t.transactionDate) ASC
    """)
    List<Object[]> findMonthlyTotalsByUserIdAndYear(
            @Param("userId") Long userId,
            @Param("year") int year
    );

    // Yearly income/expense totals
    @Query("""
        SELECT YEAR(t.transactionDate), t.type, SUM(t.amount)
        FROM Transaction t
        WHERE t.user.id = :userId
        GROUP BY YEAR(t.transactionDate), t.type
        ORDER BY YEAR(t.transactionDate) ASC
    """)
    List<Object[]> findYearlyTotalsByUserId(@Param("userId") Long userId);

    // Category breakdown for a date range (all types)
    @Query("""
        SELECT t.category.name, t.category.color, t.type, SUM(t.amount), COUNT(t)
        FROM Transaction t
        WHERE t.user.id = :userId
          AND t.transactionDate BETWEEN :start AND :end
        GROUP BY t.category.id, t.category.name, t.category.color, t.type
        ORDER BY SUM(t.amount) DESC
    """)
    List<Object[]> findCategoryBreakdownByUserIdAndDateBetween(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}