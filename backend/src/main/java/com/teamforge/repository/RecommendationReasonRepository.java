package com.teamforge.repository;

import com.teamforge.entity.RecommendationReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationReasonRepository extends JpaRepository<RecommendationReason, Long> {
    List<RecommendationReason> findByRecommendationId(Long recommendationId);
}
