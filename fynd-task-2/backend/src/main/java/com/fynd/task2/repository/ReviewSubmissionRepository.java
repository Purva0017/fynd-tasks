package com.fynd.task2.repository;

import com.fynd.task2.entity.ReviewSubmission;
import com.fynd.task2.entity.SubmissionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewSubmissionRepository extends JpaRepository<ReviewSubmission, Long> {

    Page<ReviewSubmission> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<ReviewSubmission> findByRatingOrderByCreatedAtDesc(Integer rating, Pageable pageable);

    @Query("SELECT r FROM ReviewSubmission r WHERE r.reviewText LIKE %:search% ORDER BY r.createdAt DESC")
    Page<ReviewSubmission> findByReviewTextContainingOrderByCreatedAtDesc(@Param("search") String search, Pageable pageable);

    @Query("SELECT r FROM ReviewSubmission r WHERE r.rating = :rating AND r.reviewText LIKE %:search% ORDER BY r.createdAt DESC")
    Page<ReviewSubmission> findByRatingAndReviewTextContainingOrderByCreatedAtDesc(
            @Param("rating") Integer rating,
            @Param("search") String search,
            Pageable pageable
    );

    long countByRating(Integer rating);

    long countByStatus(SubmissionStatus status);

    @Query("SELECT r.rating, COUNT(r) FROM ReviewSubmission r GROUP BY r.rating")
    List<Object[]> countByRatingGrouped();
}

