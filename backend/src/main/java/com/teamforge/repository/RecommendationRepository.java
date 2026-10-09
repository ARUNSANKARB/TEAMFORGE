package com.teamforge.repository;

import com.teamforge.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByProjectIdOrderByScoreDesc(Long projectId);
    List<Recommendation> findByCandidateIdOrderByScoreDesc(Long candidateId);
    Optional<Recommendation> findByProjectIdAndCandidateId(Long projectId, Long candidateId);
    void deleteByProjectId(Long projectId);
}
