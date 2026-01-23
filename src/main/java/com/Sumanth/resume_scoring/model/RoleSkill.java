package com.Sumanth.resume_scoring.model;

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

    @Column(name = "weight")
    private Integer weight = 5; // Default weight
}