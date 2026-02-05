package com.Sumanth.resume_scoring.service;

import com.Sumanth.resume_scoring.model.*;
import com.Sumanth.resume_scoring.repository.*;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobRoleRepository jobRoleRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(\\+?\\d{1,3}[- ]?)?\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}");

    public String extractTextFromPDF(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    /**
     * Enhanced Scoring Algorithm with Alias Matching and Mandatory Penalties
     */
    public int calculateAdvancedScore(String resumeText, Long roleId) {
        String lowerCaseText = resumeText.toLowerCase();
        JobRole role = jobRoleRepository.findById(roleId).orElse(null);
        if (role == null) return 0;

        // 1. Skills Score (60%) - Integrated with Aliases
        int skillScore = calculateSkillScore(lowerCaseText, role.getRequiredSkills());

        // 2. Experience Score (20%) - Now compares against Role requirement
        int experienceScore = calculateExperienceScore(lowerCaseText, role.getMinExperienceYears());

        // 3. Education Score (10%)
        int educationScore = calculateEducationScore(lowerCaseText);

        // 4. Quality Score (10%)
        int qualityScore = calculateQualityScore(resumeText);

        int totalScore = (int) ((skillScore * 0.6) + (experienceScore * 0.2) +
                        (educationScore * 0.1) + (qualityScore * 0.1));

        return Math.min(Math.max(0, totalScore), 100);
    }

    private int calculateSkillScore(String lowerText, List<RoleSkill> skills) {
        double matchedWeight = 0;
        double totalWeight = 0;

        for (RoleSkill skill : skills) {
            totalWeight += skill.getWeight();
            boolean found = isSkillInText(lowerText, skill.getSkillName());

            // Check Aliases if primary name not found (e.g., "Postgres" matches "PostgreSQL")
            if (!found && skill.getAliases() != null) {
                found = Arrays.stream(skill.getAliases().split(","))
                              .anyMatch(alias -> isSkillInText(lowerText, alias.trim()));
            }

            if (found) {
                matchedWeight += skill.getWeight();
            } else if (skill.isMandatory()) {
                matchedWeight -= (skill.getWeight() * 0.5); // Penalty for missing deal-breakers
            }
        }
        return totalWeight == 0 ? 0 : (int) ((matchedWeight / totalWeight) * 100);
    }

    private boolean isSkillInText(String text, String skill) {
        String pattern = "\\b" + Pattern.quote(skill.toLowerCase()) + "\\b";
        return Pattern.compile(pattern).matcher(text).find();
    }

    private int calculateExperienceScore(String text, Integer requiredYears) {
        int detectedYears = 0;
        Matcher m = Pattern.compile("(\\d+)\\+?\\s*(years?|yrs?)").matcher(text);
        while (m.find()) {
            detectedYears = Math.max(detectedYears, Integer.parseInt(m.group(1)));
        }

        if (requiredYears != null && detectedYears < requiredYears) return 40; // Under-qualified
        if (detectedYears >= 10) return 100;
        if (detectedYears >= 5) return 85;
        return 60;
    }

    /**
     * Efficient Batch Ranking Update
     * Wrapped in @Transactional to ensure data integrity
     */
    @Transactional
    public void updateRankings(Long roleId) {
        List<Candidate> candidates = candidateRepository.findByJobRoleIdOrderByTotalScoreDesc(roleId);
        for (int i = 0; i < candidates.size(); i++) {
            candidates.get(i).setRankInRole(i + 1);
        }
        candidateRepository.saveAll(candidates); // Single batch update
    }

    public String generateDetailedFeedback(String resumeText, Long roleId) {
        JobRole role = jobRoleRepository.findById(roleId).orElseThrow();
        String lowerText = resumeText.toLowerCase();

        List<String> missingMandatory = role.getRequiredSkills().stream()
                .filter(s -> s.isMandatory() && !isSkillInText(lowerText, s.getSkillName()))
                .map(RoleSkill::getSkillName)
                .collect(Collectors.toList());

        StringBuilder fb = new StringBuilder();
        if (!missingMandatory.isEmpty()) {
            fb.append("CRITICAL MISSING SKILLS: ").append(String.join(", ", missingMandatory)).append("\n\n");
        }
        fb.append("EXPERIENCE: ").append(detectExperienceLevel(resumeText));
        
        return fb.toString();
    }

    // Standard CRUD wrappers
    public Candidate saveCandidate(Candidate candidate) {
        Candidate saved = candidateRepository.save(candidate);
        updateRankings(saved.getJobRole().getId());
        return saved;
    }

    public List<Candidate> getAllCandidates() { return candidateRepository.findAll(); }
    public Optional<Candidate> getCandidateById(Long id) { return candidateRepository.findById(id); }
    public void deleteCandidate(Long id) { candidateRepository.deleteById(id); }
    public JobRole getRoleById(Long id) { return jobRoleRepository.findById(id).orElse(null); }
    public List<JobRole> getAllJobRoles() { return jobRoleRepository.findAll(); }
    public boolean emailExists(String email) { return candidateRepository.existsByEmail(email); }

    public Candidate updateStatus(Long id, String status) {
        return candidateRepository.findById(id).map(c -> {
            c.setStatus(status);
            return candidateRepository.save(c);
        }).orElse(null);
    }
}