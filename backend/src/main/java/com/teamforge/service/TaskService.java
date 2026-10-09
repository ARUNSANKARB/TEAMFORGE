package com.teamforge.service;

import com.teamforge.dto.CreateTaskRequest;
import com.teamforge.dto.TaskCommentDto;
import com.teamforge.dto.TaskDto;
import com.teamforge.entity.Project;
import com.teamforge.entity.Task;
import com.teamforge.entity.TaskComment;
import com.teamforge.entity.User;
import com.teamforge.enums.TaskStatus;
import com.teamforge.exception.ResourceNotFoundException;
import com.teamforge.repository.ProjectRepository;
import com.teamforge.repository.TaskCommentRepository;
import com.teamforge.repository.TaskRepository;
import com.teamforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskCommentRepository taskCommentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<TaskDto> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToTaskDto)
                .toList();
    }

    @Transactional
    public TaskDto createTask(Long creatorId, CreateTaskRequest request) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + request.getProjectId()));

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId()).orElse(null);
        }

        Task task = Task.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : com.teamforge.enums.TaskPriority.MEDIUM)
                .assignee(assignee)
                .dueDate(request.getDueDate())
                .build();

        Task saved = taskRepository.save(task);
        return mapToTaskDto(saved);
    }

    @Transactional
    public TaskDto updateTaskStatus(Long taskId, TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));

        task.setStatus(status);
        Task saved = taskRepository.save(task);
        return mapToTaskDto(saved);
    }

    @Transactional
    public TaskDto addComment(Long taskId, Long userId, String commentText) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        TaskComment comment = TaskComment.builder()
                .task(task)
                .user(user)
                .commentText(commentText)
                .build();

        task.getComments().add(comment);
        Task saved = taskRepository.save(task);
        return mapToTaskDto(saved);
    }

    public TaskDto mapToTaskDto(Task task) {
        List<TaskCommentDto> commentDtos = task.getComments() == null ? new ArrayList<>() :
                task.getComments().stream()
                        .map(c -> TaskCommentDto.builder()
                                .id(c.getId())
                                .taskId(task.getId())
                                .userId(c.getUser().getId())
                                .userName(c.getUser().getFullName())
                                .commentText(c.getCommentText())
                                .createdAt(c.getCreatedAt())
                                .build())
                        .toList();

        return TaskDto.builder()
                .id(task.getId())
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .assigneeName(task.getAssignee() != null ? task.getAssignee().getFullName() : "Unassigned")
                .dueDate(task.getDueDate())
                .comments(commentDtos)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
