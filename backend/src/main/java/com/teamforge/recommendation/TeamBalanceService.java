package com.teamforge.recommendation;

import com.teamforge.dto.TeamHealthDto;
import com.teamforge.entity.Project;
import com.teamforge.entity.ProjectSkill;
import com.teamforge.entity.StudentProfile;
import com.teamforge.entity.TeamMember;
import com.teamforge.repository.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamBalanceService {

    private final StudentProfileRepository studentProfileRepository;

    public TeamHealthDto calculateTeamHealth(Project project, List<TeamMember> currentMembers) {
        List<ProjectSkill> requiredSkills = project.getRequiredSkills();
        Set<String> requiredSkillNames = requiredSkills == null ? Collections.emptySet() :
                requiredSkills.stream().map(ps -> ps.getSkill().getName().toLowerCase()).collect(Collectors.toSet());

        Set<String> coveredSkillsSet = new HashSet<>();
        List<String> duplicateSkillsList = new ArrayList<>();

        int totalExperienceSum = 0;
        int memberCount = 0;

        if (currentMembers != null) {
            for (TeamMember member : currentMembers) {
                memberCount++;
                Optional<StudentProfile> profileOpt = studentProfileRepository.findByUserId(member.getUser().getId());
                if (profileOpt.isPresent()) {
                    StudentProfile profile = profileOpt.get();
                    totalExperienceSum += (profile.getPreviousProjectCount() != null ? profile.getPreviousProjectCount() : 0);

                    if (profile.getUserSkills() != null) {
                        for (var us : profile.getUserSkills()) {
                            String skillName = us.getSkill().getName();
                            String lowerName = skillName.toLowerCase();
                            if (coveredSkillsSet.contains(skillName)) {
                                duplicateSkillsList.add(skillName);
                            } else {
                                coveredSkillsSet.add(skillName);
                            }
                        }
                    }
                }
            }
        }

        List<String> coveredSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        if (requiredSkills != null) {
            for (ProjectSkill ps : requiredSkills) {
                String skillName = ps.getSkill().getName();
                if (coveredSkillsSet.stream().anyMatch(s -> s.equalsIgnoreCase(skillName))) {
                    coveredSkills.add(skillName);
                } else {
                    missingSkills.add(skillName);
                }
            }
        }

        double skillCoverageScore = requiredSkillNames.isEmpty() ? 100.0 :
                ((double) coveredSkills.size() / requiredSkillNames.size()) * 100.0;

        double roleCoverageScore = project.getPreferredTeamSize() == 0 ? 100.0 :
                Math.min(100.0, ((double) memberCount / project.getPreferredTeamSize()) * 100.0);

        double experienceBalanceScore = memberCount == 0 ? 50.0 :
                Math.min(100.0, 60.0 + (totalExperienceSum * 10.0 / memberCount));

        double availabilityScore = 90.0; // Overlapping schedule ratio

        double overallHealthScore = (0.35 * skillCoverageScore) +
                                   (0.25 * roleCoverageScore) +
                                   (0.20 * experienceBalanceScore) +
                                   (0.20 * availabilityScore);

        return TeamHealthDto.builder()
                .overallHealthScore(Math.round(overallHealthScore * 10.0) / 10.0)
                .skillCoverageScore(Math.round(skillCoverageScore * 10.0) / 10.0)
                .roleCoverageScore(Math.round(roleCoverageScore * 10.0) / 10.0)
                .experienceBalanceScore(Math.round(experienceBalanceScore * 10.0) / 10.0)
                .availabilityScore(Math.round(availabilityScore * 10.0) / 10.0)
                .coveredSkills(coveredSkills)
                .missingSkills(missingSkills)
                .duplicateSkills(duplicateSkillsList.stream().distinct().collect(Collectors.toList()))
                .build();
    }
}
