package com.Sumanth.resume_scoring.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRoleRequestDTO {
    private String roleName;
    private String description;
    private Integer minExperienceYears;
    private Integer minScoreThreshold;
    private String location;
    // Commaseparated skill names for simplicity in this project
    private String requiredSkills; 
}
