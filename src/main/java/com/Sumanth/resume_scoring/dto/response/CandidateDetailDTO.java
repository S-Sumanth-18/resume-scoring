package com.Sumanth.resume_scoring.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDetailDTO {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String linkedinUrl;
    private String githubUrl;
    private String fileName;
    private String filePath;
    private String resumeText;
    private Integer totalScore;
    private Integer technicalScore;
    private Integer softSkillsScore;
    private String status;
    private String experienceLevel;
    private Integer rankInRole;
    private String feedback;
    private List<String> tags;
    private JobRoleDTO jobRole;
}
