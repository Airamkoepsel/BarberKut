package com.barberkut.backend.dto;

import com.barberkut.backend.entity.Review;

import java.time.Instant;
import java.time.LocalDate;

public record ReviewResponse(
        Long id,
        String author,
        String initials,
        Integer rating,
        LocalDate reviewDate,
        String service,
        String body,
        Instant createdAt
) {

    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getAuthor(),
                review.getInitials(),
                review.getRating(),
                review.getReviewDate(),
                review.getService(),
                review.getBody(),
                review.getCreatedAt()
        );
    }
}
