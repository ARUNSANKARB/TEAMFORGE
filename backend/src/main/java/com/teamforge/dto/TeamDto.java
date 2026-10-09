package com.teamforge.dto;

import com.teamforge.enums.TeamStatus;
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
public class TeamDto {
    private Long id;
    private Long projectId;
    private String projectName;
    private String name;
    private Long leaderId;
    private String leaderName;
    private TeamStatus status;
    private List<TeamMemberDto> members;
    private TeamHealthDto health;
    private LocalDateTime createdAt;
}
