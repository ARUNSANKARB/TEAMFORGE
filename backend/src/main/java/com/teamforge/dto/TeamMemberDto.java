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
public class TeamMemberDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String assignedRole;
    private String department;
    private String year;
    private String profilePhoto;
    private List<UserSkillDto> skills;
    private LocalDateTime joinedAt;
}
