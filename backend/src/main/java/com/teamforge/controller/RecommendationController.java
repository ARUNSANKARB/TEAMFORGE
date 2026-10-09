package com.teamforge.controller;

import com.teamforge.dto.ApiResponse;
import com.teamforge.dto.ProjectDto;
import com.teamforge.dto.RecommendationDto;
import com.teamforge.dto.TeamDto;
import com.teamforge.entity.Project;
import com.teamforge.entity.Team;
import com.teamforge.entity.TeamMember;
import com.teamforge.exception.ResourceNotFoundException;
import com.teamforge.recommendation.RecommendationEngine;
import com.teamforge.repository.ProjectRepository;
import com.teamforge.repository.TeamMemberRepository;
import com.teamforge.repository.TeamRepository;
import com.teamforge.service.ProjectService;
import com.teamforge.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationEngine recommendationEngine;
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ProjectService projectService;
    private final TeamService teamService;

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<ApiResponse<List<RecommendationDto>>> getRecommendationsForProject(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        List<RecommendationDto> recommendations = recommendationEngine.generateRecommendations(project);
        return ResponseEntity.ok(ApiResponse.ok(recommendations));
    }

    @GetMapping("/demo")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDemoRecommendations() {
        // Find default seed project: "Smart Campus Management System" or first project
        List<Project> projects = projectRepository.findAll();
        if (projects.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error("No projects available for demo"));
        }

        Project demoProject = projects.stream()
                .filter(p -> p.getName().toLowerCase().contains("smart campus"))
                .findFirst()
                .orElse(projects.get(0));

        ProjectDto projectDto = projectService.getProjectById(demoProject.getId());
        TeamDto teamDto = teamService.getTeamByProjectId(demoProject.getId());
        List<RecommendationDto> recommendations = recommendationEngine.generateRecommendations(demoProject);

        Map<String, Object> demoResponse = new HashMap<>();
        demoResponse.put("project", projectDto);
        demoResponse.put("team", teamDto);
        demoResponse.put("recommendations", recommendations);

        return ResponseEntity.ok(ApiResponse.ok("Live AI Team Recommendation Demo Dataset Loaded", demoResponse));
    }

    @PostMapping("/demo/reset")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> resetDemoState() {
        List<Project> projects = projectRepository.findAll();
        if (!projects.isEmpty()) {
            Project demoProject = projects.stream()
                    .filter(p -> p.getName().toLowerCase().contains("smart campus"))
                    .findFirst()
                    .orElse(projects.get(0));

            Optional<Team> teamOpt = teamRepository.findByProjectId(demoProject.getId());
            if (teamOpt.isPresent()) {
                Team team = teamOpt.get();
                List<TeamMember> members = teamMemberRepository.findByTeamId(team.getId());
                for (TeamMember m : members) {
                    // Keep leader (Kamalesh) and Abijay, remove others added during demo
                    if (!m.getUser().getId().equals(team.getTeamLeader().getId()) &&
                        !m.getUser().getFullName().equalsIgnoreCase("Abijay R")) {
                        teamMemberRepository.delete(m);
                    }
                }
                teamMemberRepository.flush();
                demoProject.setCurrentTeamSize(2);
                projectRepository.saveAndFlush(demoProject);
            }
        }
        return ResponseEntity.ok(ApiResponse.ok("Demo state reset to initial seed benchmark", null));
    }

    @PostMapping("/teams/{teamId}/add-member/{userId}")
    public ResponseEntity<ApiResponse<TeamDto>> addCandidateToTeam(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            @RequestParam(required = false, defaultValue = "Full-Stack Specialist") String role) {

        TeamDto updatedTeam = teamService.addMemberDirectly(teamId, userId, role);
        return ResponseEntity.ok(ApiResponse.ok("Candidate added to team. Team Health score dynamically updated!", updatedTeam));
    }
}
