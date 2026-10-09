package com.teamforge.recommendation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationScoreCalculator {

    private final RecommendationWeights weights;

    public double calculateOverallScore(
            double skillMatch,
            double skillComplementarity,
            double roleCompatibility,
            double interestMatch,
            double experienceCompatibility,
            double availabilityMatch,
            double preferenceMatch,
            double teamBalance) {

        double totalScore = (weights.getSkillMatch() * skillMatch) +
                           (weights.getSkillComplementarity() * skillComplementarity) +
                           (weights.getRoleCompatibility() * roleCompatibility) +
                           (weights.getInterestMatch() * interestMatch) +
                           (weights.getExperienceCompatibility() * experienceCompatibility) +
                           (weights.getAvailabilityMatch() * availabilityMatch) +
                           (weights.getPreferenceMatch() * preferenceMatch) +
                           (weights.getTeamBalance() * teamBalance);

        return Math.min(100.0, Math.max(0.0, Math.round(totalScore * 10.0) / 10.0));
    }
}
