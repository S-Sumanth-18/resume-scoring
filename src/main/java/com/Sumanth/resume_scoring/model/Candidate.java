package com.Sumanth.resume_scoring.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
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

    @Column(name = "resume_text", columnDefinition = "TEXT")
    private String resumeText;

    @Column(name = "file_name")
    private String fileName;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private JobRole jobRole;

    @Column(name = "total_score")
    private Integer totalScore;

    @Column(name = "status")
    private String status = "NEW"; // NEW, UNDER_REVIEW, SHORTLISTED, INTERVIEWED, SELECTED, REJECTED

    @Column(name = "experience_level")
    private String experienceLevel; // JUNIOR, MID_LEVEL, SENIOR

    @Column(name = "rank_in_role")
    private Integer rankInRole;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "created_at")
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