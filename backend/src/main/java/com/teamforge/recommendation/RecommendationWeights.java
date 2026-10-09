package com.teamforge.recommendation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "teamforge.recommendation.weights")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationWeights {
    private double skillMatch = 0.30;
    private double skillComplementarity = 0.20;
    private double roleCompatibility = 0.15;
    private double interestMatch = 0.10;
    private double experienceCompatibility = 0.10;
    private double availabilityMatch = 0.05;
    private double preferenceMatch = 0.05;
    private double teamBalance = 0.05;
}
