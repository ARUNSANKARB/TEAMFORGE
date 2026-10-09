package com.teamforge.controller;

import com.teamforge.dto.ApiResponse;
import com.teamforge.dto.CreateProjectRequest;
import com.teamforge.dto.ProjectDto;
import com.teamforge.entity.User;
import com.teamforge.enums.DifficultyLevel;
import com.teamforge.enums.ProjectDomain;
import com.teamforge.enums.ProjectStatus;
import com.teamforge.service.AuthService;
import com.teamforge.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjects(
            @RequestParam(required = false) ProjectDomain domain,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) DifficultyLevel difficulty,
            @RequestParam(required = false) String search) {

        List<ProjectDto> projects = projectService.getProjects(domain, status, difficulty, search);
        return ResponseEntity.ok(ApiResponse.ok(projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(@PathVariable Long id) {
        ProjectDto project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.ok(project));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(Authentication authentication,
                                                                 @Valid @RequestBody CreateProjectRequest request) {
        User owner = authService.getCurrentUser(authentication.getName());
        ProjectDto created = projectService.createProject(owner.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Project created successfully", created));
    }
}
