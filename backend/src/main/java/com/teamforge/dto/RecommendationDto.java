package com.teamforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDto {
    private Long id;
    private Long projectId;
    private String projectName;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidateRole;
    private String candidateCollege;
    private String candidateDepartment;
    private String candidateYear;
    private String profilePhoto;
    private Double score; // Total score 0 - 100
    private Double skillMatchScore;
    private Double skillComplementarityScore;
    private Double roleCompatibilityScore;
    private Double interestMatchScore;
    private Double experienceCompatibilityScore;
    private Double availabilityMatchScore;
    private Double preferenceMatchScore;
    private Double teamBalanceScore;
    private List<UserSkillDto> candidateSkills;
    private List<RecommendationReasonDto> reasons;
    private List<String> matchedSkills;
    private List<String> missingSkillsProvided;
    private LocalDateTime generatedAt;
}
