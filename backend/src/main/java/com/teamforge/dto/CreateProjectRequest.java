package com.teamforge.dto;

import com.teamforge.enums.DifficultyLevel;
import com.teamforge.enums.ProjectDomain;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateProjectRequest {
    @NotBlank(message = "Project name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    private String problemStatement;

    @NotNull(message = "Domain is required")
    private ProjectDomain domain;

    private DifficultyLevel difficulty = DifficultyLevel.INTERMEDIATE;

    @Min(value = 1, message = "Team size must be at least 1")
    private Integer preferredTeamSize = 4;

    private Integer weeklyCommitmentHours = 15;
    private LocalDate deadline;

    private List<Long> mandatorySkillIds;
    private List<Long> preferredSkillIds;
}
