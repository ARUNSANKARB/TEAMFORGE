package com.teamforge.controller;

import com.teamforge.dto.ApiResponse;
import com.teamforge.dto.InviteMemberRequest;
import com.teamforge.dto.TeamDto;
import com.teamforge.entity.TeamInvitation;
import com.teamforge.entity.User;
import com.teamforge.service.AuthService;
import com.teamforge.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final AuthService authService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<TeamDto>> getTeamByProjectId(@PathVariable Long projectId) {
        TeamDto team = teamService.getTeamByProjectId(projectId);
        return ResponseEntity.ok(ApiResponse.ok(team));
    }

    @GetMapping("/invitations/me")
    public ResponseEntity<ApiResponse<List<TeamInvitation>>> getMyInvitations(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<TeamInvitation> invitations = teamService.getUserInvitations(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(invitations));
    }

    @PostMapping("/invite")
    public ResponseEntity<ApiResponse<TeamInvitation>> sendInvitation(Authentication authentication,
                                                                       @Valid @RequestBody InviteMemberRequest request) {
        User inviter = authService.getCurrentUser(authentication.getName());
        TeamInvitation invitation = teamService.sendInvitation(inviter.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Invitation sent successfully", invitation));
    }

    @PostMapping("/invitations/{id}/accept")
    public ResponseEntity<ApiResponse<TeamDto>> acceptInvitation(Authentication authentication, @PathVariable Long id) {
        User user = authService.getCurrentUser(authentication.getName());
        TeamDto team = teamService.acceptInvitation(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Invitation accepted", team));
    }

    @PostMapping("/invitations/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectInvitation(Authentication authentication, @PathVariable Long id) {
        User user = authService.getCurrentUser(authentication.getName());
        teamService.rejectInvitation(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Invitation rejected", null));
    }

    @PostMapping("/{teamId}/members/add")
    public ResponseEntity<ApiResponse<TeamDto>> addMemberDirectly(
            @PathVariable Long teamId,
            @RequestParam Long userId,
            @RequestParam(required = false) String role) {

        TeamDto team = teamService.addMemberDirectly(teamId, userId, role);
        return ResponseEntity.ok(ApiResponse.ok("Candidate added to team & team health updated dynamically", team));
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<ApiResponse<TeamDto>> removeMember(@PathVariable Long teamId, @PathVariable Long userId) {
        TeamDto team = teamService.removeMember(teamId, userId);
        return ResponseEntity.ok(ApiResponse.ok("Member removed from team", team));
    }

    @PutMapping("/{teamId}/members/{userId}/role")
    public ResponseEntity<ApiResponse<TeamDto>> updateMemberRole(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            @RequestParam String role) {

        TeamDto team = teamService.updateMemberRole(teamId, userId, role);
        return ResponseEntity.ok(ApiResponse.ok("Team member role updated successfully", team));
    }
}
