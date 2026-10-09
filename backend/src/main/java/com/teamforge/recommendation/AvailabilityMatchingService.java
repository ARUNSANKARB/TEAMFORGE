package com.teamforge.recommendation;

import com.teamforge.entity.Project;
import com.teamforge.entity.StudentProfile;
import org.springframework.stereotype.Service;

@Service
public class AvailabilityMatchingService {

    public double calculateAvailabilityMatchScore(StudentProfile candidateProfile, Project project) {
        int candidateHours = candidateProfile.getAvailabilityHours() != null ? candidateProfile.getAvailabilityHours() : 15;
        int requiredHours = project.getWeeklyCommitmentHours() != null ? project.getWeeklyCommitmentHours() : 15;

        if (candidateHours >= requiredHours) {
            return 95.0 + Math.min(5.0, (candidateHours - requiredHours));
        }

        double ratio = (double) candidateHours / requiredHours;
        return Math.max(30.0, Math.round(ratio * 100.0 * 10.0) / 10.0);
    }

    public double calculateExperienceScore(StudentProfile candidateProfile) {
        Integer projectCount = candidateProfile.getPreviousProjectCount();
        
        // Neutral cold-start policy: Newcomers with 0 project history receive 50% neutral prior
        if (projectCount == null || projectCount == 0) {
            return 50.0;
        }

        if (projectCount == 1) return 70.0;
        if (projectCount == 2) return 85.0;
        if (projectCount >= 3) return 95.0;

        return 75.0;
    }
}
