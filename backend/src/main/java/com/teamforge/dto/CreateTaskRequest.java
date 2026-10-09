package com.teamforge.dto;

import com.teamforge.enums.TaskPriority;
import com.teamforge.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateTaskRequest {
    @NotNull(message = "Project ID is required")
    private Long projectId;

    private Long teamId;

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;
    private TaskStatus status = TaskStatus.TODO;
    private TaskPriority priority = TaskPriority.MEDIUM;
    private Long assigneeId;
    private LocalDate dueDate;
}
