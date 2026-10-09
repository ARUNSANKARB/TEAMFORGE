package com.teamforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDto {
    private long totalStudents;
    private long totalProjects;
    private long totalTeams;
    private long activeProjects;
    private long completedProjects;
    private long totalRecommendationsGenerated;
    private double averageCompatibilityScore;

    private Map<String, Long> projectsByDomain;
    private Map<String, Long> studentsBySkill;
    private Map<String, Long> projectStatusDistribution;
    private Map<String, Long> skillDemandMap;
}
