package com.teamforge.dto;

import com.teamforge.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String college;
    private String department;
    private String year;
    private RoleType role;
    private String bio;
    private String profilePhoto;
    private String preferredRole;
    private String secondaryRole;
    private String projectInterests;
    private Integer availabilityHours;
    private Integer previousProjectCount;
    private Boolean leadershipExperience;
    private Integer preferredTeamSize;
    private String communicationPreference;
    private String workPreference;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private List<UserSkillDto> skills;
}
