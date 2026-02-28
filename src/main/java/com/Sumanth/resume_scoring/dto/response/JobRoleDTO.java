package com.Sumanth.resume_scoring.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRoleDTO {
    private Long id;
    private String roleName;
    private String description;
    private Integer minExperienceYears;
    private String location;
    private Integer applicationCount;
    // We can expand this with skills if needed, but keeping it simple for now
}
