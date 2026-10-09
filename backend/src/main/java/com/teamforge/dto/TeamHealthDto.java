package com.teamforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamHealthDto {
    private Double overallHealthScore;
    private Double skillCoverageScore;
    private Double roleCoverageScore;
    private Double experienceBalanceScore;
    private Double availabilityScore;
    private List<String> coveredSkills;
    private List<String> missingSkills;
    private List<String> duplicateSkills;
}
