package com.teamforge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String profilePhoto;
    private String preferredRole;
    private String secondaryRole;

    @Column(columnDefinition = "TEXT")
    private String projectInterests; // Comma-separated list or JSON

    private Integer availabilityHours = 15;
    private Integer previousProjectCount = 0;
    private Boolean leadershipExperience = false;
    private Integer preferredTeamSize = 4;
    private String communicationPreference = "Slack / Discord";
    private String workPreference = "Hybrid";

    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<UserSkill> userSkills = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
