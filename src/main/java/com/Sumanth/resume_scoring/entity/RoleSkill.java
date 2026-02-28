package com.Sumanth.resume_scoring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "role_skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    @JsonIgnore
    private JobRole jobRole;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    // SaaS Feature: Support synonyms (e.g. "PostgreSQL, Postgres") to increase match accuracy
    @Column(name = "aliases")
    private String aliases;

    @Column(name = "weight")
    private Integer weight = 5; 

    // Advanced Scoring Feature: If true, the system can flag candidates missing this skill
    @Column(name = "is_mandatory")
    private boolean isMandatory = false;

    // UI Feature: Helps categorize skills into tabs or sections in the Vite dashboard
    @Column(name = "category")
    private String category; // e.g., "Languages", "Frameworks", "Cloud"
}