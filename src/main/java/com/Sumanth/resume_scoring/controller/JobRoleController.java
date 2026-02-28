package com.Sumanth.resume_scoring.controller;

import com.Sumanth.resume_scoring.dto.CandidateMapper;
import com.Sumanth.resume_scoring.dto.request.JobRoleRequestDTO;
import com.Sumanth.resume_scoring.dto.response.JobRoleDTO;
import com.Sumanth.resume_scoring.entity.JobRole;
import com.Sumanth.resume_scoring.service.JobRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
public class JobRoleController {

    @Autowired
    private JobRoleService jobRoleService;

    @GetMapping
    public ResponseEntity<List<JobRoleDTO>> getAllRoles() {
        return ResponseEntity.ok(jobRoleService.getAllJobRoles().stream()
                .map(CandidateMapper::toJobRoleDto)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobRoleDTO> getRoleById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(CandidateMapper.toJobRoleDto(jobRoleService.getRoleById(id)));
    }

    @PostMapping
    public ResponseEntity<JobRoleDTO> createRole(@RequestBody JobRoleRequestDTO request) {
        JobRole saved = jobRoleService.createRole(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(CandidateMapper.toJobRoleDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobRoleDTO> updateRole(@PathVariable("id") Long id, @RequestBody JobRoleRequestDTO request) {
        JobRole updated = jobRoleService.updateRole(id, request);
        return ResponseEntity.ok(CandidateMapper.toJobRoleDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRole(@PathVariable("id") Long id) {
        jobRoleService.deleteRole(id);
        return ResponseEntity.ok(Map.of("message", "Role deleted successfully"));
    }
}
