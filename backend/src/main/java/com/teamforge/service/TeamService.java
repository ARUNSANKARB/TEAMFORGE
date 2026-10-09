package com.teamforge.service;

import com.teamforge.dto.*;
import com.teamforge.entity.*;
import com.teamforge.enums.InvitationStatus;
import com.teamforge.exception.BadRequestException;
import com.teamforge.exception.ResourceNotFoundException;
import com.teamforge.recommendation.TeamBalanceService;
import com.teamforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamInvitationRepository teamInvitationRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final TeamBalanceService teamBalanceService;
    private final UserProfileService userProfileService;

    public TeamDto getTeamByProjectId(Long projectId) {
        Team team = teamRepository.findByProjectId(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found for project: " + projectId));
        return mapToTeamDto(team);
    }

    public List<TeamInvitation> getUserInvitations(Long userId) {
        return teamInvitationRepository.findByInviteeIdAndStatus(userId, InvitationStatus.PENDING);
    }

    @Transactional
    public TeamInvitation sendInvitation(Long inviterId, InviteMemberRequest request) {
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + request.getTeamId()));

        User inviter = userRepository.findById(inviterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + inviterId));

        User invitee = userRepository.findById(request.getInviteeId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate user not found: " + request.getInviteeId()));

        if (teamMemberRepository.existsByTeamIdAndUserId(team.getId(), invitee.getId())) {
            throw new BadRequestException("Candidate is already a member of this team.");
        }

        TeamInvitation invitation = TeamInvitation.builder()
                .team(team)
                .inviter(inviter)
                .invitee(invitee)
                .message(request.getMessage() != null ? request.getMessage() : "You are invited to join " + team.getName() + " on TeamForge!")
                .status(InvitationStatus.PENDING)
                .build();

        return teamInvitationRepository.save(invitation);
    }

    @Transactional
    public TeamDto acceptInvitation(Long invitationId, Long userId) {
        TeamInvitation invitation = teamInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found: " + invitationId));

        if (!invitation.getInvitee().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to respond to this invitation.");
        }

        invitation.setStatus(InvitationStatus.ACCEPTED);
        teamInvitationRepository.save(invitation);

        Team team = invitation.getTeam();
        if (!teamMemberRepository.existsByTeamIdAndUserId(team.getId(), userId)) {
            TeamMember newMember = TeamMember.builder()
                    .team(team)
                    .user(invitation.getInvitee())
                    .assignedRole("Team Member")
                    .build();
            teamMemberRepository.save(newMember);

            // Update current team size in Project
            Project project = team.getProject();
            project.setCurrentTeamSize(project.getCurrentTeamSize() + 1);
            projectRepository.save(project);
        }

        return mapToTeamDto(team);
    }

    @Transactional
    public TeamDto addMemberDirectly(Long teamId, Long userId, String role) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + teamId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (!teamMemberRepository.existsByTeamIdAndUserId(team.getId(), user.getId())) {
            TeamMember newMember = TeamMember.builder()
                    .team(team)
                    .user(user)
                    .assignedRole(role != null ? role : "Collaborator")
                    .build();
            teamMemberRepository.saveAndFlush(newMember);

            Project project = team.getProject();
            project.setCurrentTeamSize(project.getCurrentTeamSize() + 1);
            projectRepository.saveAndFlush(project);
        }

        return mapToTeamDto(team);
    }

    @Transactional
    public void rejectInvitation(Long invitationId, Long userId) {
        TeamInvitation invitation = teamInvitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found: " + invitationId));

        if (!invitation.getInvitee().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized");
        }

        invitation.setStatus(InvitationStatus.REJECTED);
        teamInvitationRepository.save(invitation);
    }

    @Transactional
    public TeamDto removeMember(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + teamId));

        Optional<TeamMember> memberOpt = teamMemberRepository.findByTeamIdAndUserId(teamId, userId);
        if (memberOpt.isPresent()) {
            teamMemberRepository.delete(memberOpt.get());
            teamMemberRepository.flush(); // FLUSH IMMEDIATELY

            Project project = team.getProject();
            if (project.getCurrentTeamSize() > 1) {
                project.setCurrentTeamSize(project.getCurrentTeamSize() - 1);
                projectRepository.saveAndFlush(project);
            }
        }

        return mapToTeamDto(team);
    }

    @Transactional
    public TeamDto updateMemberRole(Long teamId, Long userId, String newRole) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found: " + teamId));

        TeamMember member = teamMemberRepository.findByTeamIdAndUserId(teamId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Team member not found for user: " + userId));

        member.setAssignedRole(newRole);
        teamMemberRepository.saveAndFlush(member);

        return mapToTeamDto(team);
    }

    public TeamDto mapToTeamDto(Team team) {
        List<TeamMember> members = teamMemberRepository.findByTeamId(team.getId());
        List<TeamMemberDto> memberDtos = new ArrayList<>();

        for (TeamMember m : members) {
            UserProfileDto prof = userProfileService.getProfileByUserId(m.getUser().getId());
            memberDtos.add(TeamMemberDto.builder()
                    .id(m.getId())
                    .userId(m.getUser().getId())
                    .fullName(m.getUser().getFullName())
                    .email(m.getUser().getEmail())
                    .assignedRole(m.getAssignedRole())
                    .department(m.getUser().getDepartment())
                    .year(m.getUser().getYear())
                    .profilePhoto(prof.getProfilePhoto())
                    .skills(prof.getSkills())
                    .joinedAt(m.getJoinedAt())
                    .build());
        }

        TeamHealthDto health = teamBalanceService.calculateTeamHealth(team.getProject(), members);

        return TeamDto.builder()
                .id(team.getId())
                .projectId(team.getProject().getId())
                .projectName(team.getProject().getName())
                .name(team.getName())
                .leaderId(team.getTeamLeader().getId())
                .leaderName(team.getTeamLeader().getFullName())
                .status(team.getStatus())
                .members(memberDtos)
                .health(health)
                .createdAt(team.getCreatedAt())
                .build();
    }
}
