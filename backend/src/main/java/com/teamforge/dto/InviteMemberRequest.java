package com.teamforge.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InviteMemberRequest {
    @NotNull(message = "Team ID is required")
    private Long teamId;

    @NotNull(message = "Candidate ID is required")
    private Long inviteeId;

    private String message;
}
