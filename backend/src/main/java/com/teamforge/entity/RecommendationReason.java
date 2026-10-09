package com.teamforge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recommendation_reasons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationReason {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommendation_id", nullable = false)
    private Recommendation recommendation;

    @Column(nullable = false, length = 50)
    private String type; // SKILL_MATCH, COMPLEMENTARITY, INTEREST, AVAILABILITY, EXPERIENCE

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explanationText;

    @Column(nullable = false)
    private boolean isPositive = true;
}
