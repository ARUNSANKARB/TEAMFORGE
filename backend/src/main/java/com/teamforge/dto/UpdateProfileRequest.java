package com.teamforge.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
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
}
