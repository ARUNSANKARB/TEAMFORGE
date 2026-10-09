package com.teamforge.service;

import com.teamforge.dto.CreateProjectRequest;
import com.teamforge.dto.ProjectDto;
import com.teamforge.dto.ProjectSkillDto;
import com.teamforge.dto.TeamHealthDto;
import com.teamforge.entity.*;
import com.teamforge.enums.DifficultyLevel;
import com.teamforge.enums.ProjectDomain;
import com.teamforge.enums.ProjectStatus;
import com.teamforge.enums.TeamStatus;
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
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamBalanceService teamBalanceService;

    public List<ProjectDto> getProjects(ProjectDomain domain, ProjectStatus status, DifficultyLevel difficulty, String search) {
        List<Project> projects = projectRepository.filterProjects(domain, status, difficulty, search);
        return projects.stream().map(this::mapToProjectDto).toList();
    }

    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToProjectDto(project);
    }

    @Transactional
    public ProjectDto createProject(Long ownerId, CreateProjectRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + ownerId));

        Project project = Project.builder()
                .owner(owner)
                .name(request.getName())
                .description(request.getDescription())
                .problemStatement(request.getProblemStatement())
                .domain(request.getDomain())
                .status(ProjectStatus.RECRUITING)
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : DifficultyLevel.INTERMEDIATE)
                .preferredTeamSize(request.getPreferredTeamSize() != null ? request.getPreferredTeamSize() : 4)
                .currentTeamSize(1)
                .weeklyCommitmentHours(request.getWeeklyCommitmentHours() != null ? request.getWeeklyCommitmentHours() : 15)
                .deadline(request.getDeadline())
                .build();

        Project savedProject = projectRepository.save(project);

        final Project targetProject = savedProject;

        // Add mandatory and preferred skills
        List<ProjectSkill> requiredSkills = new ArrayList<>();
        if (request.getMandatorySkillIds() != null) {
            for (Long skillId : request.getMandatorySkillIds()) {
                Optional<Skill> skillOpt = skillRepository.findById(skillId);
                skillOpt.ifPresent(skill -> requiredSkills.add(ProjectSkill.builder()
                        .project(targetProject)
                        .skill(skill)
                        .isMandatory(true)
                        .build()));
            }
        }

        if (request.getPreferredSkillIds() != null) {
            for (Long skillId : request.getPreferredSkillIds()) {
                Optional<Skill> skillOpt = skillRepository.findById(skillId);
                skillOpt.ifPresent(skill -> requiredSkills.add(ProjectSkill.builder()
                        .project(targetProject)
                        .skill(skill)
                        .isMandatory(false)
                        .build()));
            }
        }

        savedProject.setRequiredSkills(requiredSkills);
        savedProject = projectRepository.save(savedProject);

        // Auto-create associated Team with Owner as Team Leader & Member
        Team team = Team.builder()
                .project(savedProject)
                .name(savedProject.getName() + " Team")
                .teamLeader(owner)
                .status(TeamStatus.RECRUITING)
                .build();

        Team savedTeam = teamRepository.save(team);

        TeamMember leaderMember = TeamMember.builder()
                .team(savedTeam)
                .user(owner)
                .assignedRole("Project Lead / Architect")
                .build();

        teamMemberRepository.save(leaderMember);

        return mapToProjectDto(savedProject);
    }

    public ProjectDto mapToProjectDto(Project project) {
        List<ProjectSkillDto> skillDtos = project.getRequiredSkills() == null ? new ArrayList<>() :
                project.getRequiredSkills().stream()
                        .map(ps -> ProjectSkillDto.builder()
                                .id(ps.getId())
                                .skillId(ps.getSkill().getId())
                                .skillName(ps.getSkill().getName())
                                .category(ps.getSkill().getCategory().name())
                                .isMandatory(ps.isMandatory())
                                .build())
                        .toList();

        // Fetch team health if team exists
        TeamHealthDto teamHealth = null;
        Optional<Team> teamOpt = teamRepository.findByProjectId(project.getId());
        if (teamOpt.isPresent()) {
            List<TeamMember> members = teamMemberRepository.findByTeamId(teamOpt.get().getId());
            teamHealth = teamBalanceService.calculateTeamHealth(project, members);
        }

        return ProjectDto.builder()
                .id(project.getId())
                .ownerId(project.getOwner().getId())
                .ownerName(project.getOwner().getFullName())
                .name(project.getName())
                .description(project.getDescription())
                .problemStatement(project.getProblemStatement())
                .domain(project.getDomain())
                .status(project.getStatus())
                .difficulty(project.getDifficulty())
                .preferredTeamSize(project.getPreferredTeamSize())
                .currentTeamSize(project.getCurrentTeamSize())
                .weeklyCommitmentHours(project.getWeeklyCommitmentHours())
                .deadline(project.getDeadline())
                .requiredSkills(skillDtos)
                .matchPercentage(88.0) // General compatibility index indicator
                .teamHealth(teamHealth)
                .createdAt(project.getCreatedAt())
                .build();
    }
}
