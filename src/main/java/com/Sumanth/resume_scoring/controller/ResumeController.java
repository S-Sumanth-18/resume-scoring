package com.Sumanth.resume_scoring.controller;

import com.Sumanth.resume_scoring.model.Candidate;
import com.Sumanth.resume_scoring.model.JobRole;
import com.Sumanth.resume_scoring.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*") // Update this to your Vite dev URL in production
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    /**
     * Upload and analyze resume with role-based scoring
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam("roleId") Long roleId) {

        try {
            // 1. Validation Logic
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Please upload a valid file."));
            }
            
            if (resumeService.emailExists(email)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "A candidate with this email is already registered."));
            }

            // Using a direct find instead of streaming all roles for better performance
            JobRole role = resumeService.getRoleById(roleId);
            if (role == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "The selected Job Role is invalid."));
            }

            // 2. Processing Phase
            String resumeText = resumeService.extractTextFromPDF(file);
            int score = resumeService.calculateAdvancedScore(resumeText, roleId);
            String experienceLevel = resumeService.detectExperienceLevel(resumeText);
            String feedback = resumeService.generateDetailedFeedback(resumeText, roleId);

            // 3. Entity Construction
            Candidate candidate = new Candidate();
            candidate.setName(name);
            candidate.setEmail(email);
            candidate.setPhoneNumber(phone);
            candidate.setFileName(file.getOriginalFilename());
            candidate.setResumeText(resumeText);
            candidate.setTotalScore(score);
            candidate.setFeedback(feedback);
            candidate.setJobRole(role);
            candidate.setExperienceLevel(experienceLevel);
            candidate.setStatus("NEW");

            Candidate savedCandidate = resumeService.saveCandidate(candidate);

            // 4. Structured Response for React Frontend
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "candidateId", savedCandidate.getId(),
                "score", score,
                "rank", savedCandidate.getRankInRole(),
                "experienceLevel", experienceLevel,
                "message", "Resume analyzed and candidate registered successfully."
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Processing failed: " + e.getMessage()));
        }
    }

    /**
     * Get all candidates with optional filtering by role
     * Recommended: Implement Pagination here for SaaS scalability
     */
    @GetMapping("/candidates")
    public ResponseEntity<List<Candidate>> getCandidates(@RequestParam(required = false) Long roleId) {
        if (roleId != null) {
            return ResponseEntity.ok(resumeService.getCandidatesByRole(roleId));
        }
        return ResponseEntity.ok(resumeService.getAllCandidates());
    }

    /**
     * Update candidate status (e.g., Shortlisted, Rejected)
     */
    @PatchMapping("/candidates/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload) {
        
        String status = payload.get("status");
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status field is required."));
        }

        Candidate updated = resumeService.updateStatus(id, status);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @GetMapping("/roles")
    public ResponseEntity<List<JobRole>> getAllRoles() {
        return ResponseEntity.ok(resumeService.getAllJobRoles());
    }

    @DeleteMapping("/candidates/{id}")
    public ResponseEntity<?> deleteCandidate(@PathVariable Long id) {
        try {
            resumeService.deleteCandidate(id);
            return ResponseEntity.ok(Map.of("message", "Candidate removed successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Candidate not found."));
        }
    }
}