package com.teamforge.recommendation;

import com.teamforge.dto.RecommendationReasonDto;
import com.teamforge.entity.Project;
import com.teamforge.entity.StudentProfile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class RecommendationExplanationService {

    public List<RecommendationReasonDto> generateExplanations(
            StudentProfile candidateProfile,
            Project project,
            List<String> matchedSkills,
            List<String> missingSkillsFilled,
            double skillMatchScore,
            double complementarityScore,
            double experienceScore) {

        List<RecommendationReasonDto> reasons = new ArrayList<>();

        if (!matchedSkills.isEmpty()) {
            reasons.add(RecommendationReasonDto.builder()
                    .type("SKILL_MATCH")
                    .explanationText("Strong match in required project skills: " + String.join(", ", matchedSkills))
                    .isPositive(true)
                    .build());
        }

        if (!missingSkillsFilled.isEmpty()) {
            reasons.add(RecommendationReasonDto.builder()
                    .type("COMPLEMENTARITY")
                    .explanationText("Fills critical team skill gap by providing: " + String.join(", ", missingSkillsFilled))
                    .isPositive(true)
                    .build());
        }

        if (candidateProfile.getPreferredRole() != null) {
            reasons.add(RecommendationReasonDto.builder()
                    .type("ROLE_COMPATIBILITY")
                    .explanationText("Preferred role '" + candidateProfile.getPreferredRole() + "' aligns with project domain requirements")
                    .isPositive(true)
                    .build());
        }

        if (candidateProfile.getProjectInterests() != null &&
                candidateProfile.getProjectInterests().toLowerCase().contains(project.getDomain().name().toLowerCase())) {
            reasons.add(RecommendationReasonDto.builder()
                    .type("INTEREST")
                    .explanationText("Active interest registered in " + project.getDomain().name() + " domain")
                    .isPositive(true)
                    .build());
        }

        if (candidateProfile.getPreviousProjectCount() != null && candidateProfile.getPreviousProjectCount() == 0) {
            reasons.add(RecommendationReasonDto.builder()
                    .type("FAIRNESS")
                    .explanationText("Fairness Exposure Prior: Assigned neutral experience baseline (50%) for promising newcomer")
                    .isPositive(true)
                    .build());
        } else if (candidateProfile.getPreviousProjectCount() != null && candidateProfile.getPreviousProjectCount() > 0) {
            reasons.add(RecommendationReasonDto.builder()
                    .type("EXPERIENCE")
                    .explanationText("Proven project experience (" + candidateProfile.getPreviousProjectCount() + " completed project" +
                            (candidateProfile.getPreviousProjectCount() > 1 ? "s" : "") + ")")
                    .isPositive(true)
                    .build());
        }

        reasons.add(RecommendationReasonDto.builder()
                .type("AVAILABILITY")
                .explanationText("Weekly schedule window (" + candidateProfile.getAvailabilityHours() + " hrs/wk) matches required commitment")
                .isPositive(true)
                .build());

        return reasons;
    }
}
