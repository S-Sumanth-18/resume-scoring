package com.Sumanth.resume_scoring.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResponseDTO {
    private Long id;
    private String name;
    private String email;
    private Integer totalScore;
    private String status;
    private String roleName;
    private String experienceLevel;
    private Integer rankInRole;
}
