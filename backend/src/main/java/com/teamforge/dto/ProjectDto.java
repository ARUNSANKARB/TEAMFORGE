package com.teamforge.dto;

import com.teamforge.enums.DifficultyLevel;
import com.teamforge.enums.ProjectDomain;
import com.teamforge.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private Long id;
    private Long ownerId;
    private String ownerName;
    private String name;
    private String description;
    private String problemStatement;
    private ProjectDomain domain;
    private ProjectStatus status;
    private DifficultyLevel difficulty;
    private Integer preferredTeamSize;
    private Integer currentTeamSize;
    private Integer weeklyCommitmentHours;
    private LocalDate deadline;
    private List<ProjectSkillDto> requiredSkills;
    private Double matchPercentage; // Optional user-specific match percentage
    private TeamHealthDto teamHealth;
    private LocalDateTime createdAt;
}
