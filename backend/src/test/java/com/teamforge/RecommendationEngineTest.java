package com.teamforge;

import com.teamforge.dto.RecommendationDto;
import com.teamforge.entity.Project;
import com.teamforge.entity.User;
import com.teamforge.enums.ProjectDomain;
import com.teamforge.enums.RoleType;
import com.teamforge.recommendation.RecommendationEngine;
import com.teamforge.repository.ProjectRepository;
import com.teamforge.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class RecommendationEngineTest {

    @Autowired
    private RecommendationEngine recommendationEngine;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Test Multi-Factor Recommendation Generation & Ranking Accuracy")
    public void testRecommendationGeneration() {
        List<Project> projects = projectRepository.findAll();
        Assertions.assertFalse(projects.isEmpty(), "Projects should be seeded in database");

        Project project = projects.get(0);
        List<RecommendationDto> recommendations = recommendationEngine.generateRecommendations(project);

        Assertions.assertNotNull(recommendations, "Recommendations list should not be null");
        Assertions.assertFalse(recommendations.isEmpty(), "Recommendation engine should produce candidates");

        // Verify descending order ranking
        for (int i = 0; i < recommendations.size() - 1; i++) {
            Assertions.assertTrue(
                    recommendations.get(i).getScore() >= recommendations.get(i + 1).getScore(),
                    "Recommendations must be sorted descending by overall compatibility score"
            );
        }

        // Verify explainability reasons exist
        RecommendationDto topRec = recommendations.get(0);
        Assertions.assertNotNull(topRec.getReasons(), "Recommendation explanation reasons should be present");
        Assertions.assertFalse(topRec.getReasons().isEmpty(), "Explanation card should contain itemized matching reasons");
    }
}
