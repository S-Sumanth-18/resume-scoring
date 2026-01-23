package com.Sumanth.resume_scoring.service;

import com.Sumanth.resume_scoring.model.Candidate;
import com.Sumanth.resume_scoring.model.JobRole;
import com.Sumanth.resume_scoring.model.RoleSkill;
import com.Sumanth.resume_scoring.repository.CandidateRepository;
import com.Sumanth.resume_scoring.repository.JobRoleRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobRoleRepository jobRoleRepository;

    /**
     * Extract text from PDF resume
     */
    public String extractTextFromPDF(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    /**
     * Advanced Scoring Algorithm
     * Formula: Skills(60%) + Experience(20%) + Education(10%) + Quality(10%)
     */
    public int calculateAdvancedScore(String resumeText, Long roleId) {
        String lowerCaseText = resumeText.toLowerCase();

        // Get role-specific skills
        Optional<JobRole> roleOpt = jobRoleRepository.findById(roleId);
        if (roleOpt.isEmpty()) {
            return 0;
        }

        JobRole role = roleOpt.get();
        List<RoleSkill> requiredSkills = role.getRequiredSkills();

        // 1. Skills Score (60%)
        int skillScore = calculateSkillScore(lowerCaseText, requiredSkills);

        // 2. Experience Score (20%)
        int experienceScore = calculateExperienceScore(lowerCaseText);

        // 3. Education Score (10%)
        int educationScore = calculateEducationScore(lowerCaseText);

        // 4. Resume Quality Score (10%)
        int qualityScore = calculateQualityScore(resumeText);

        // Weighted total
        int totalScore = (int) ((skillScore * 0.6) + (experienceScore * 0.2) +
                (educationScore * 0.1) + (qualityScore * 0.1));

        return Math.min(totalScore, 100);
    }

    /**
     * Calculate skill match score
     */
    private int calculateSkillScore(String resumeText, List<RoleSkill> requiredSkills) {
        int matchedWeight = 0;
        int totalWeight = 0;
        String lowerText = resumeText.toLowerCase();

        for (RoleSkill skill : requiredSkills) {
            totalWeight += skill.getWeight();
            String skillName = skill.getSkillName().toLowerCase();

            // Use word boundary regex for accurate matching
            String pattern = "\\b" + Pattern.quote(skillName) + "\\b";
            if (Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(lowerText).find()) {
                matchedWeight += skill.getWeight();
            }
        }

        if (totalWeight == 0) return 0;
        return (int) ((matchedWeight / (double) totalWeight) * 100);
    }

    /**
     * Detect experience level and score
     */
    private int calculateExperienceScore(String resumeText) {
        // Look for years of experience
        Pattern yearPattern = Pattern.compile("(\\d+)\\+?\\s*(years?|yrs?)");
        Matcher matcher = yearPattern.matcher(resumeText);

        int maxYears = 0;
        while (matcher.find()) {
            try {
                int years = Integer.parseInt(matcher.group(1));
                maxYears = Math.max(maxYears, years);
            } catch (NumberFormatException e) {
                // Ignore
            }
        }

        // Keywords for experience levels
        if (resumeText.contains("senior") || resumeText.contains("lead") ||
                resumeText.contains("architect") || resumeText.contains("manager")) {
            return 100;
        } else if (resumeText.contains("mid-level") || maxYears >= 3) {
            return 70;
        } else if (resumeText.contains("junior") || resumeText.contains("fresher") ||
                resumeText.contains("intern") || resumeText.contains("graduate")) {
            return 40;
        }

        // Based on years
        if (maxYears >= 5) return 100;
        if (maxYears >= 3) return 70;
        if (maxYears >= 1) return 50;
        return 30;
    }

    /**
     * Detect education level and score
     */
    private int calculateEducationScore(String resumeText) {
        int score = 0;

        // Degrees
        if (resumeText.contains("phd") || resumeText.contains("doctorate")) {
            score += 40;
        } else if (resumeText.contains("master") || resumeText.contains("m.tech") ||
                resumeText.contains("msc") || resumeText.contains("mba")) {
            score += 30;
        } else if (resumeText.contains("bachelor") || resumeText.contains("b.tech") ||
                resumeText.contains("bsc") || resumeText.contains("be")) {
            score += 20;
        }

        // Certifications
        if (resumeText.contains("certified") || resumeText.contains("certification")) {
            score += 30;
        }

        // Universities
        if (resumeText.contains("university") || resumeText.contains("institute")) {
            score += 20;
        }

        return Math.min(score, 100);
    }

    /**
     * Calculate resume quality score
     */
    private int calculateQualityScore(String resumeText) {
        int score = 0;

        // Length check (500-3000 words is ideal)
        int wordCount = resumeText.split("\\s+").length;
        if (wordCount >= 500 && wordCount <= 3000) {
            score += 30;
        } else if (wordCount >= 300) {
            score += 20;
        }

        // Has contact section
        if (resumeText.toLowerCase().contains("email") ||
                resumeText.toLowerCase().contains("phone") ||
                resumeText.toLowerCase().contains("contact")) {
            score += 20;
        }

        // Has experience section
        if (resumeText.toLowerCase().contains("experience") ||
                resumeText.toLowerCase().contains("work history")) {
            score += 25;
        }

        // Has education section
        if (resumeText.toLowerCase().contains("education") ||
                resumeText.toLowerCase().contains("qualification")) {
            score += 25;
        }

        return Math.min(score, 100);
    }

    /**
     * Detect experience level
     */
    public String detectExperienceLevel(String resumeText) {
        String lowerText = resumeText.toLowerCase();

        // STEP 1: Check for student/fresher indicators FIRST (highest priority)
        if (lowerText.contains("aspiring") ||
                lowerText.contains("currently pursuing") ||
                lowerText.contains("expected graduation") ||
                lowerText.contains("final year") ||
                lowerText.contains("undergraduate") ||
                lowerText.matches(".*\\d{2}/\\d{4}\\s*-\\s*present.*")) {
            return "JUNIOR";
        }

        // STEP 2: Look for explicit work experience with years
        Pattern workExpPattern = Pattern.compile("(\\d+)\\+?\\s*years?\\s+(?:of\\s+)?(?:work\\s+|professional\\s+)?experience");
        Matcher workMatcher = workExpPattern.matcher(lowerText);

        if (workMatcher.find()) {
            try {
                int years = Integer.parseInt(workMatcher.group(1));
                if (years >= 5) return "SENIOR";
                if (years >= 2) return "MID_LEVEL";
                return "JUNIOR";
            } catch (NumberFormatException e) {
                // Continue to next checks
            }
        }

        // STEP 3: Check for senior job titles (use word boundaries for exact matching)
        // Senior Developer/Engineer
        if (lowerText.matches(".*\\bsenior\\s+(developer|engineer|software|programmer|analyst|consultant)\\b.*")) {
            return "SENIOR";
        }

        // Lead positions
        if (lowerText.matches(".*\\b(tech\\s+lead|technical\\s+lead|team\\s+lead|lead\\s+developer|lead\\s+engineer)\\b.*")) {
            return "SENIOR";
        }

        // Architect positions
        if (lowerText.matches(".*\\b(software\\s+architect|solution\\s+architect|systems\\s+architect|enterprise\\s+architect)\\b.*")) {
            return "SENIOR";
        }

        // Manager positions
        if (lowerText.matches(".*\\b(engineering\\s+manager|development\\s+manager|technical\\s+manager)\\b.*")) {
            return "SENIOR";
        }

        // STEP 4: Check for mid-level indicators
        Pattern midYearPattern = Pattern.compile("(\\d+)\\s*years?");
        Matcher midMatcher = midYearPattern.matcher(lowerText);
        while (midMatcher.find()) {
            try {
                int years = Integer.parseInt(midMatcher.group(1));
                if (years >= 3 && years < 5) return "MID_LEVEL";
            } catch (NumberFormatException e) {
                // Continue
            }
        }

        // STEP 5: Explicit fresher keywords
        if (lowerText.contains("fresher") ||
                lowerText.contains("recent graduate") ||
                lowerText.contains("entry level") ||
                lowerText.contains("seeking opportunities")) {
            return "JUNIOR";
        }

        // DEFAULT: If nothing matched, assume JUNIOR (safest default)
        return "JUNIOR";
    }

    /**
     * Generate detailed feedback
     */
    public String generateDetailedFeedback(String resumeText, Long roleId) {
        Optional<JobRole> roleOpt = jobRoleRepository.findById(roleId);
        if (roleOpt.isEmpty()) {
            return "Invalid role selected";
        }

        JobRole role = roleOpt.get();
        List<RoleSkill> requiredSkills = role.getRequiredSkills();
        String lowerText = resumeText.toLowerCase();

        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        for (RoleSkill skill : requiredSkills) {
            if (lowerText.contains(skill.getSkillName().toLowerCase())) {
                strengths.add(skill.getSkillName());
            } else {
                weaknesses.add(skill.getSkillName());
            }
        }

        // Generate recommendations
        if (weaknesses.size() > 5) {
            recommendations.add("Consider gaining expertise in missing core skills");
        }
        if (!lowerText.contains("project")) {
            recommendations.add("Add more project details to showcase practical experience");
        }
        if (!lowerText.contains("github") && !lowerText.contains("portfolio")) {
            recommendations.add("Include links to GitHub or portfolio");
        }

        StringBuilder feedback = new StringBuilder();
        feedback.append("STRENGTHS:\n");
        feedback.append(String.join(", ", strengths.isEmpty() ? List.of("None identified") : strengths));
        feedback.append("\n\nWEAKNESSES:\n");
        feedback.append(String.join(", ", weaknesses.isEmpty() ? List.of("None identified") : weaknesses));
        feedback.append("\n\nRECOMMENDATIONS:\n");
        feedback.append(String.join("\n- ", recommendations.isEmpty() ? List.of("Keep up the good work!") : recommendations));

        return feedback.toString();
    }

    /**
     * Update candidate rankings for a role
     */
    public void updateRankings(Long roleId) {
        List<Candidate> candidates = candidateRepository.findByJobRoleIdOrderByTotalScoreDesc(roleId);
        int rank = 1;
        for (Candidate candidate : candidates) {
            candidate.setRankInRole(rank++);
            candidateRepository.save(candidate);
        }
    }

    /**
     * Save candidate with analysis
     */
    public Candidate saveCandidate(Candidate candidate) {
        Candidate saved = candidateRepository.save(candidate);
        if (candidate.getJobRole() != null) {
            updateRankings(candidate.getJobRole().getId());
        }
        return saved;
    }

    /**
     * Get all candidates
     */
    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    /**
     * Get candidate by ID
     */
    public Optional<Candidate> getCandidateById(Long id) {
        return candidateRepository.findById(id);
    }

    /**
     * Delete candidate
     */
    public void deleteCandidate(Long id) {
        candidateRepository.deleteById(id);
    }

    /**
     * Update candidate status
     */
    public Candidate updateStatus(Long id, String status) {
        Optional<Candidate> candidateOpt = candidateRepository.findById(id);
        if (candidateOpt.isPresent()) {
            Candidate candidate = candidateOpt.get();
            candidate.setStatus(status);
            return candidateRepository.save(candidate);
        }
        return null;
    }

    /**
     * Get all job roles
     */
    public List<JobRole> getAllJobRoles() {
        return jobRoleRepository.findAll();
    }

    /**
     * Check if email already exists
     */
    public boolean emailExists(String email) {
        return candidateRepository.existsByEmail(email);
    }
}