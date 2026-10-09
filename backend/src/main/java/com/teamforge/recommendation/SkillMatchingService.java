package com.teamforge.recommendation;

import com.teamforge.entity.Project;
import com.teamforge.entity.ProjectSkill;
import com.teamforge.entity.StudentProfile;
import com.teamforge.entity.UserSkill;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillMatchingService {

    public double calculateSkillMatchScore(StudentProfile candidateProfile, Project project) {
        List<ProjectSkill> requiredSkills = project.getRequiredSkills();
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return 80.0;
        }

        Map<Long, Integer> candidateSkillMap = new HashMap<>();
        if (candidateProfile.getUserSkills() != null) {
            for (UserSkill us : candidateProfile.getUserSkills()) {
                candidateSkillMap.put(us.getSkill().getId(), us.getProficiencyLevel().getValue() * 25);
            }
        }

        double totalPossibleScore = 0.0;
        double earnedScore = 0.0;

        for (ProjectSkill ps : requiredSkills) {
            double skillWeight = ps.isMandatory() ? 1.0 : 0.5;
            totalPossibleScore += 100.0 * skillWeight;

            Long skillId = ps.getSkill().getId();
            if (candidateSkillMap.containsKey(skillId)) {
                earnedScore += candidateSkillMap.get(skillId) * skillWeight;
            }
        }

        if (totalPossibleScore == 0) return 100.0;
        return Math.min(100.0, Math.round((earnedScore / totalPossibleScore) * 100.0 * 10.0) / 10.0);
    }

    public double calculateComplementarityScore(StudentProfile candidateProfile, Project project, Set<String> existingTeamSkills) {
        List<ProjectSkill> requiredSkills = project.getRequiredSkills();
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return 75.0;
        }

        Set<String> candidateSkills = candidateProfile.getUserSkills() == null ? Collections.emptySet() :
                candidateProfile.getUserSkills().stream()
                        .map(us -> us.getSkill().getName().toLowerCase())
                        .collect(Collectors.toSet());

        List<String> missingSkills = requiredSkills.stream()
                .map(ps -> ps.getSkill().getName().toLowerCase())
                .filter(skillName -> !existingTeamSkills.contains(skillName))
                .collect(Collectors.toList());

        if (missingSkills.isEmpty()) {
            return 85.0; // Team already covers all skills, high baseline
        }

        long filledCount = missingSkills.stream()
                .filter(candidateSkills::contains)
                .count();

        double score = ((double) filledCount / missingSkills.size()) * 100.0;
        return Math.round(score * 10.0) / 10.0;
    }

    public List<String> getMissingSkillsFilled(StudentProfile candidateProfile, Project project, Set<String> existingTeamSkills) {
        if (candidateProfile.getUserSkills() == null) return Collections.emptyList();

        Set<String> candidateSkills = candidateProfile.getUserSkills().stream()
                .map(us -> us.getSkill().getName())
                .collect(Collectors.toSet());

        return project.getRequiredSkills().stream()
                .map(ps -> ps.getSkill().getName())
                .filter(skillName -> !existingTeamSkills.contains(skillName.toLowerCase()) && candidateSkills.contains(skillName))
                .collect(Collectors.toList());
    }
}
