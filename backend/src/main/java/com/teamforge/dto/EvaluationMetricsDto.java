package com.teamforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationMetricsDto {
    private double precision;
    private double recall;
    private double f1Score;
    private double skillCoverageRate;
    private double averageTeamCompatibility;
    private double newcomerExposureRate;
    private int sampleTestCases;
    private String notes;
}
