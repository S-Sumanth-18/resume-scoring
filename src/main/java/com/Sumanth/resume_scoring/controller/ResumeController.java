package com.Sumanth.resume_scoring.controller;

import com.Sumanth.resume_scoring.model.Candidate;
import com.Sumanth.resume_scoring.model.JobRole;
import com.Sumanth.resume_scoring.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    /**
     * Upload and analyze resume with role-based scoring
     */
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam("roleId") Long roleId) {

        Map<String, Object> response = new HashMap<>();

        try {
            // Check for duplicate email
            if (resumeService.emailExists(email)) {
                response.put("error", "Email already exists. Candidate already registered.");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file
            if (file.isEmpty()) {
                response.put("error", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate role
            Optional<JobRole> roleOpt = resumeService.getAllJobRoles().stream()
                    .filter(r -> r.getId().equals(roleId))
                    .findFirst();

            if (roleOpt.isEmpty()) {
                response.put("error", "Invalid role selected");
                return ResponseEntity.badRequest().body(response);
            }

            // Extract text from PDF
            String resumeText = resumeService.extractTextFromPDF(file);

            // Calculate advanced score
            int score = resumeService.calculateAdvancedScore(resumeText, roleId);

            // Detect experience level
            String experienceLevel = resumeService.detectExperienceLevel(resumeText);

            // Generate detailed feedback
            String feedback = resumeService.generateDetailedFeedback(resumeText, roleId);

            // Create candidate object
            Candidate candidate = new Candidate();
            candidate.setName(name);
            candidate.setEmail(email);
            candidate.setPhoneNumber(phone);
            candidate.setFileName(file.getOriginalFilename());
            candidate.setResumeText(resumeText);
            candidate.setTotalScore(score);
            candidate.setFeedback(feedback);
            candidate.setJobRole(roleOpt.get());
            candidate.setExperienceLevel(experienceLevel);
            candidate.setStatus("NEW");

            // Save to database (also updates rankings)
            Candidate savedCandidate = resumeService.saveCandidate(candidate);

            // Prepare response
            response.put("success", true);
            response.put("message", "Resume analyzed successfully");
            response.put("candidateId", savedCandidate.getId());
            response.put("score", score);
            response.put("experienceLevel", experienceLevel);
            response.put("feedback", feedback);
            response.put("rank", savedCandidate.getRankInRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Failed to process resume: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get all job roles
     */
    @GetMapping("/roles")
    public ResponseEntity<List<JobRole>> getAllRoles() {
        List<JobRole> roles = resumeService.getAllJobRoles();
        return ResponseEntity.ok(roles);
    }

    /**
     * Get all candidates
     */
    @GetMapping("/candidates")
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        List<Candidate> candidates = resumeService.getAllCandidates();
        return ResponseEntity.ok(candidates);
    }

    /**
     * Get candidate by ID
     */
    @GetMapping("/candidates/{id}")
    public ResponseEntity<Candidate> getCandidateById(@PathVariable Long id) {
        Optional<Candidate> candidate = resumeService.getCandidateById(id);
        return candidate.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get candidates by role
     */
    @GetMapping("/candidates/role/{roleId}")
    public ResponseEntity<List<Candidate>> getCandidatesByRole(@PathVariable Long roleId) {
        List<Candidate> candidates = resumeService.getAllCandidates().stream()
                .filter(c -> c.getJobRole() != null && c.getJobRole().getId().equals(roleId))
                .toList();
        return ResponseEntity.ok(candidates);
    }

    /**
     * Delete candidate
     */
    @DeleteMapping("/candidates/{id}")
    public ResponseEntity<Map<String, String>> deleteCandidate(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();

        try {
            Optional<Candidate> candidate = resumeService.getCandidateById(id);

            if (candidate.isEmpty()) {
                response.put("error", "Candidate not found");
                return ResponseEntity.notFound().build();
            }

            resumeService.deleteCandidate(id);
            response.put("message", "Candidate deleted successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Failed to delete candidate: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Update candidate status
     */
    @PutMapping("/candidates/{id}/status")
    public ResponseEntity<Candidate> updateStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {

        try {
            Candidate updated = resumeService.updateStatus(id, status);

            if (updated == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Resume Scoring API is running with enhanced features!");
    }
}