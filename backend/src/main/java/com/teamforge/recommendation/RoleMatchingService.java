package com.teamforge.recommendation;

import com.teamforge.entity.Project;
import com.teamforge.entity.StudentProfile;
import org.springframework.stereotype.Service;

@Service
public class RoleMatchingService {

    public double calculateRoleCompatibilityScore(StudentProfile candidateProfile, Project project) {
        String preferredRole = candidateProfile.getPreferredRole();
        String secondaryRole = candidateProfile.getSecondaryRole();

        if (preferredRole == null) return 60.0;

        String domainName = project.getDomain().name().toLowerCase();
        String roleLower = preferredRole.toLowerCase();

        if (roleLower.contains("backend") && domainName.contains("web")) return 95.0;
        if (roleLower.contains("frontend") && domainName.contains("web")) return 95.0;
        if (roleLower.contains("ml") || roleLower.contains("ai") || roleLower.contains("data")) {
            if (domainName.contains("ai") || domainName.contains("data")) return 98.0;
        }
        if (roleLower.contains("fullstack")) return 90.0;

        if (secondaryRole != null && !secondaryRole.isEmpty()) return 80.0;

        return 75.0;
    }

    public double calculateInterestMatchScore(StudentProfile candidateProfile, Project project) {
        String interests = candidateProfile.getProjectInterests();
        if (interests == null || interests.isEmpty()) return 70.0;

        String domain = project.getDomain().name().toLowerCase();
        String interestsLower = interests.toLowerCase();

        if (interestsLower.contains(domain) || interestsLower.contains(project.getName().toLowerCase())) {
            return 98.0;
        }
        return 70.0;
    }
}
