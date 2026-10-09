package com.teamforge.recommendation;

import com.teamforge.dto.RecommendationDto;
import com.teamforge.dto.RecommendationReasonDto;
import com.teamforge.dto.UserSkillDto;
import com.teamforge.entity.*;
import com.teamforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationEngine {

    private final StudentProfileRepository studentProfileRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final SkillMatchingService skillMatchingService;
    private final RoleMatchingService roleMatchingService;
    private final AvailabilityMatchingService availabilityMatchingService;
    private final RecommendationScoreCalculator scoreCalculator;
    private final RecommendationExplanationService explanationService;

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<RecommendationDto> generateRecommendations(Project project) {
        Optional<Team> teamOpt = teamRepository.findByProjectId(project.getId());
        List<TeamMember> currentTeamMembers = teamOpt.map(t -> teamMemberRepository.findByTeamId(t.getId()))
                .orElse(Collections.emptyList());

        Set<String> existingTeamSkills = new HashSet<>();
        Set<Long> existingMemberUserIds = new HashSet<>();
        existingMemberUserIds.add(project.getOwner().getId());

        if (currentTeamMembers != null) {
            for (TeamMember tm : currentTeamMembers) {
                existingMemberUserIds.add(tm.getUser().getId());
                Optional<StudentProfile> profOpt = studentProfileRepository.findByUserId(tm.getUser().getId());
                if (profOpt.isPresent() && profOpt.get().getUserSkills() != null) {
                    for (var us : profOpt.get().getUserSkills()) {
                        existingTeamSkills.add(us.getSkill().getName().toLowerCase());
                    }
                }
            }
        }

        List<StudentProfile> allProfiles = studentProfileRepository.findAll();
        List<RecommendationDto> recommendationList = new ArrayList<>();

        for (StudentProfile profile : allProfiles) {
            User candidateUser = profile.getUser();
            // Eligibility filter: exclude owner and existing members
            if (existingMemberUserIds.contains(candidateUser.getId())) {
                continue;
            }

            // Hard Eligibility Constraint: Availability check
            int candidateHours = profile.getAvailabilityHours() != null ? profile.getAvailabilityHours() : 15;
            int requiredHours = project.getWeeklyCommitmentHours() != null ? project.getWeeklyCommitmentHours() : 15;
            if (candidateHours < requiredHours * 0.5) {
                continue; // Failed minimum availability threshold
            }

            // Calculate component scores
            double skillMatch = skillMatchingService.calculateSkillMatchScore(profile, project);
            double complementarity = skillMatchingService.calculateComplementarityScore(profile, project, existingTeamSkills);
            double roleCompat = roleMatchingService.calculateRoleCompatibilityScore(profile, project);
            double interestMatch = roleMatchingService.calculateInterestMatchScore(profile, project);
            double availabilityMatch = availabilityMatchingService.calculateAvailabilityMatchScore(profile, project);
            double experienceCompat = availabilityMatchingService.calculateExperienceScore(profile);
            double preferenceMatch = 85.0;
            double teamBalance = 80.0;

            double overallScore = scoreCalculator.calculateOverallScore(
                    skillMatch, complementarity, roleCompat, interestMatch,
                    experienceCompat, availabilityMatch, preferenceMatch, teamBalance
            );

            // Calculate matched skills & missing skills filled
            Set<String> candidateSkillNames = profile.getUserSkills() == null ? Collections.emptySet() :
                    profile.getUserSkills().stream().map(us -> us.getSkill().getName()).collect(Collectors.toSet());

            List<String> matchedSkills = project.getRequiredSkills().stream()
                    .map(ps -> ps.getSkill().getName())
                    .filter(candidateSkillNames::contains)
                    .collect(Collectors.toList());

            List<String> missingSkillsFilled = skillMatchingService.getMissingSkillsFilled(profile, project, existingTeamSkills);

            List<RecommendationReasonDto> reasons = explanationService.generateExplanations(
                    profile, project, matchedSkills, missingSkillsFilled,
                    skillMatch, complementarity, experienceCompat
            );

            List<UserSkillDto> skillDtos = profile.getUserSkills() == null ? Collections.emptyList() :
                    profile.getUserSkills().stream()
                            .map(us -> UserSkillDto.builder()
                                    .id(us.getId())
                                    .skillId(us.getSkill().getId())
                                    .skillName(us.getSkill().getName())
                                    .category(us.getSkill().getCategory().name())
                                    .proficiencyLevel(us.getProficiencyLevel())
                                    .build())
                            .collect(Collectors.toList());

            RecommendationDto dto = RecommendationDto.builder()
                    .id(profile.getId()) // temporary fallback ID
                    .projectId(project.getId())
                    .projectName(project.getName())
                    .candidateId(candidateUser.getId())
                    .candidateName(candidateUser.getFullName())
                    .candidateEmail(candidateUser.getEmail())
                    .candidateRole(profile.getPreferredRole() != null ? profile.getPreferredRole() : "Software Developer")
                    .candidateCollege(candidateUser.getCollege())
                    .candidateDepartment(candidateUser.getDepartment())
                    .candidateYear(candidateUser.getYear())
                    .profilePhoto(profile.getProfilePhoto())
                    .score(overallScore)
                    .skillMatchScore(skillMatch)
                    .skillComplementarityScore(complementarity)
                    .roleCompatibilityScore(roleCompat)
                    .interestMatchScore(interestMatch)
                    .experienceCompatibilityScore(experienceCompat)
                    .availabilityMatchScore(availabilityMatch)
                    .preferenceMatchScore(preferenceMatch)
                    .teamBalanceScore(teamBalance)
                    .candidateSkills(skillDtos)
                    .reasons(reasons)
                    .matchedSkills(matchedSkills)
                    .missingSkillsProvided(missingSkillsFilled)
                    .build();

            recommendationList.add(dto);
        }

        // Sort descending by overall compatibility score
        recommendationList.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return recommendationList;
    }
}
