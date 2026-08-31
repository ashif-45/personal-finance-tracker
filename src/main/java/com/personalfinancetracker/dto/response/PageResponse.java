package com.personalfinancetracker.dto.response;

import org.springframework.data.domain.Page;
import java.util.List;

public record PageResponse<T>(
        List<T> content,
        int pageNumber,
        int pageSize,
        long totalElements,
        int totalPages,
        boolean isLast
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        // If size is Integer.MAX_VALUE, return -1 to the frontend
        int reportedSize = (page.getSize() == Integer.MAX_VALUE) ? -1 : page.getSize();
        
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                reportedSize,
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}