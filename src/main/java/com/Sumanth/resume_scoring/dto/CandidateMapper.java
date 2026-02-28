package com.Sumanth.resume_scoring.dto;

import com.Sumanth.resume_scoring.dto.response.CandidateDetailDTO;
import com.Sumanth.resume_scoring.dto.response.CandidateResponseDTO;
import com.Sumanth.resume_scoring.dto.response.JobRoleDTO;
import com.Sumanth.resume_scoring.entity.Candidate;
import com.Sumanth.resume_scoring.entity.JobRole;

public class CandidateMapper {

    public static CandidateResponseDTO toResponseDto(Candidate candidate) {
        if (candidate == null) return null;
        
        return CandidateResponseDTO.builder()
                .id(candidate.getId())
                .name(candidate.getName())
                .email(candidate.getEmail())
                .totalScore(candidate.getTotalScore())
                .status(candidate.getStatus())
                .roleName(candidate.getJobRole() != null ? candidate.getJobRole().getRoleName() : null)
                .experienceLevel(candidate.getExperienceLevel())
                .rankInRole(candidate.getRankInRole())
                .build();
    }

    public static CandidateDetailDTO toDetailDto(Candidate candidate) {
        if (candidate == null) return null;
        
        return CandidateDetailDTO.builder()
                .id(candidate.getId())
                .name(candidate.getName())
                .email(candidate.getEmail())
                .phoneNumber(candidate.getPhoneNumber())
                .linkedinUrl(candidate.getLinkedinUrl())
                .githubUrl(candidate.getGithubUrl())
                .fileName(candidate.getFileName())
                .filePath(candidate.getFilePath())
                .resumeText(candidate.getResumeText())
                .totalScore(candidate.getTotalScore())
                .technicalScore(candidate.getTechnicalScore())
                .softSkillsScore(candidate.getSoftSkillsScore())
                .status(candidate.getStatus())
                .experienceLevel(candidate.getExperienceLevel())
                .rankInRole(candidate.getRankInRole())
                .feedback(candidate.getFeedback())
                .tags(candidate.getTags())
                .jobRole(toJobRoleDto(candidate.getJobRole()))
                .build();
    }

    public static JobRoleDTO toJobRoleDto(JobRole jobRole) {
        if (jobRole == null) return null;

        return JobRoleDTO.builder()
                .id(jobRole.getId())
                .roleName(jobRole.getRoleName())
                .description(jobRole.getDescription())
                .minExperienceYears(jobRole.getMinExperienceYears())
                .location(jobRole.getLocation())
                .applicationCount(jobRole.getApplicationCount())
                .build();
    }
}
