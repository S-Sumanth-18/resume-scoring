package com.Sumanth.resume_scoring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "candidates", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_role_id", columnList = "role_id"),
    @Index(name = "idx_total_score", columnList = "total_score")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    // SaaS Feature: Quick links for recruiters
    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "resume_text", columnDefinition = "TEXT")
    private String resumeText;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_path")
    private String filePath;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private JobRole jobRole;

    @Column(name = "total_score")
    private Integer totalScore;

    // SaaS Feature: Multi-dimensional scoring for UI charts
    @Column(name = "technical_score")
    private Integer technicalScore;

    @Column(name = "soft_skills_score")
    private Integer softSkillsScore;

    @Column(name = "status")
    private String status = "NEW"; 

    @Column(name = "experience_level")
    private String experienceLevel; 

    @Column(name = "rank_in_role")
    private Integer rankInRole;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    // SaaS Feature: Tags for easy filtering in the UI (e.g., "Top 10%", "Fast Learner")
    @ElementCollection
    @CollectionTable(name = "candidate_tags", joinColumns = @JoinColumn(name = "candidate_id"))
    @Column(name = "tag")
    private List<String> tags;

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