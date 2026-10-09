package com.teamforge.controller;

import com.teamforge.dto.ApiResponse;
import com.teamforge.dto.CreateTaskRequest;
import com.teamforge.dto.TaskDto;
import com.teamforge.entity.User;
import com.teamforge.enums.TaskStatus;
import com.teamforge.service.AuthService;
import com.teamforge.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final AuthService authService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasksByProjectId(@PathVariable Long projectId) {
        List<TaskDto> tasks = taskService.getTasksByProjectId(projectId);
        return ResponseEntity.ok(ApiResponse.ok(tasks));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskDto>> createTask(Authentication authentication,
                                                           @Valid @RequestBody CreateTaskRequest request) {
        User creator = authService.getCurrentUser(authentication.getName());
        TaskDto created = taskService.createTask(creator.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Task created successfully", created));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskDto>> updateStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
        TaskDto updated = taskService.updateTaskStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", updated));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<TaskDto>> addComment(Authentication authentication,
                                                           @PathVariable Long id,
                                                           @RequestParam String commentText) {
        User user = authService.getCurrentUser(authentication.getName());
        TaskDto updated = taskService.addComment(id, user.getId(), commentText);
        return ResponseEntity.ok(ApiResponse.ok("Comment added", updated));
    }
}
