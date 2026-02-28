package com.Sumanth.resume_scoring.service;

import com.Sumanth.resume_scoring.dto.request.JobRoleRequestDTO;
import com.Sumanth.resume_scoring.entity.JobRole;
import com.Sumanth.resume_scoring.entity.RoleSkill;
import com.Sumanth.resume_scoring.exception.ResourceNotFoundException;
import com.Sumanth.resume_scoring.repository.JobRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobRoleService {
    @Autowired
    private JobRoleRepository jobRoleRepository;

    public List<JobRole> getAllJobRoles() {
        return jobRoleRepository.findAll();
    }

    public JobRole getRoleById(Long id) {
        return jobRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job Role with ID " + id + " not found"));
    }

    @Transactional
    public JobRole createRole(JobRoleRequestDTO request) {
        JobRole jobRole = new JobRole();
        updateEntityFromDto(jobRole, request);
        return jobRoleRepository.save(jobRole);
    }

    @Transactional
    public JobRole updateRole(Long id, JobRoleRequestDTO request) {
        JobRole jobRole = getRoleById(id);
        updateEntityFromDto(jobRole, request);
        return jobRoleRepository.save(jobRole);
    }

    @Transactional
    public void deleteRole(Long id) {
        JobRole jobRole = getRoleById(id);
        jobRoleRepository.delete(jobRole);
    }

    private void updateEntityFromDto(JobRole jobRole, JobRoleRequestDTO request) {
        jobRole.setRoleName(request.getRoleName());
        jobRole.setDescription(request.getDescription());
        jobRole.setMinExperienceYears(request.getMinExperienceYears());
        jobRole.setMinScoreThreshold(request.getMinScoreThreshold() != null ? request.getMinScoreThreshold() : 0);
        jobRole.setLocation(request.getLocation());

        if (request.getRequiredSkills() != null && !request.getRequiredSkills().isEmpty()) {
            List<String> skillNames = Arrays.stream(request.getRequiredSkills().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());

            List<RoleSkill> skills = new ArrayList<>();
            for (String skillName : skillNames) {
                RoleSkill rs = new RoleSkill();
                rs.setSkillName(skillName);
                rs.setJobRole(jobRole);
                rs.setWeight(5); // Default weight
                rs.setMandatory(true); // Treat as mandatory for simple SaaS version
                skills.add(rs);
            }

            if (jobRole.getRequiredSkills() != null) {
                jobRole.getRequiredSkills().clear();
                jobRole.getRequiredSkills().addAll(skills);
            } else {
                jobRole.setRequiredSkills(skills);
            }
        }
    }
}
