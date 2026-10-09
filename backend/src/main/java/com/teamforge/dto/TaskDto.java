package com.teamforge.dto;

import com.teamforge.enums.TaskPriority;
import com.teamforge.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private Long id;
    private Long projectId;
    private String projectName;
    private Long teamId;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private Long assigneeId;
    private String assigneeName;
    private LocalDate dueDate;
    private List<TaskCommentDto> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
