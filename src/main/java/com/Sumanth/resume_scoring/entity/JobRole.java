package com.Sumanth.resume_scoring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "job_roles", indexes = {
    @Index(name = "idx_role_name", columnList = "role_name"),
    @Index(name = "idx_is_active", columnList = "is_active")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "role_name", nullable = false, unique = true)
    private String roleName;

    @Column(columnDefinition = "TEXT")
    private String description;

    // SaaS Feature: Allows recruiters to pause applications without deleting the role
    @Column(name = "is_active")
    private boolean isActive = true;

    // Advanced Scoring Feature: Used to penalize/boost scores based on seniority
    @Column(name = "min_experience_years")
    private Integer minExperienceYears;

    @Column(name = "location")
    private String location;

    // SaaS Feature: Track how many people have applied to this role for UI badges
    @Column(name = "application_count")
    private Integer applicationCount = 0;

    @Column(name = "min_score_threshold")
    private Integer minScoreThreshold;

    @OneToMany(mappedBy = "jobRole", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RoleSkill> requiredSkills;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
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