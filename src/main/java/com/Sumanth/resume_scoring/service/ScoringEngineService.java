package com.Sumanth.resume_scoring.service;

import com.Sumanth.resume_scoring.entity.JobRole;
import com.Sumanth.resume_scoring.entity.RoleSkill;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ScoringEngineService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(\\+?\\d{1,3}[- ]?)?\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}");

    public int calculateAdvancedScore(String resumeText, JobRole role) {
        if (role == null) return 0;
        String lowerCaseText = resumeText.toLowerCase();

        int skillScore = calculateSkillScore(lowerCaseText, role.getRequiredSkills());
        int experienceScore = calculateExperienceScore(lowerCaseText, role.getMinExperienceYears());
        int educationScore = calculateEducationScore(lowerCaseText);
        int qualityScore = calculateQualityScore(resumeText);

        int totalScore = (int) ((skillScore * 0.6) + (experienceScore * 0.2) +
                                (educationScore * 0.1) + (qualityScore * 0.1));

        return Math.min(Math.max(0, totalScore), 100);
    }

    private int calculateSkillScore(String lowerText, List<RoleSkill> skills) {
        double matchedWeight = 0;
        double totalWeight = 0;

        if (skills == null) return 0;

        for (RoleSkill skill : skills) {
            totalWeight += skill.getWeight();
            boolean found = isSkillInText(lowerText, skill.getSkillName());

            if (!found && skill.getAliases() != null && !skill.getAliases().isEmpty()) {
                found = Arrays.stream(skill.getAliases().split(","))
                              .anyMatch(alias -> isSkillInText(lowerText, alias.trim()));
            }

            if (found) {
                matchedWeight += skill.getWeight();
            } else if (skill.isMandatory()) {
                matchedWeight -= (skill.getWeight() * 0.5); 
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

        if (requiredYears != null && detectedYears < requiredYears) return 40;
        if (detectedYears >= 10) return 100;
        if (detectedYears >= 5) return 85;
        return 60;
    }

    private int calculateEducationScore(String lowerText) {
        if (lowerText.contains("phd") || lowerText.contains("doctorate")) return 100;
        if (lowerText.contains("masters") || lowerText.contains("m.tech") || lowerText.contains("mba")) return 90;
        if (lowerText.contains("bachelor") || lowerText.contains("b.tech") || lowerText.contains("b.e")) return 80;
        return 50;
    }

    private int calculateQualityScore(String resumeText) {
        int score = 100;
        if (!EMAIL_PATTERN.matcher(resumeText).find()) score -= 30;
        if (!PHONE_PATTERN.matcher(resumeText).find()) score -= 30;
        if (resumeText.length() < 500) score -= 20; 
        return Math.max(0, score);
    }

    public String detectExperienceLevel(String text) {
        int years = 0;
        Matcher m = Pattern.compile("(\\d+)\\+?\\s*(years?|yrs?)").matcher(text.toLowerCase());
        while (m.find()) {
            years = Math.max(years, Integer.parseInt(m.group(1)));
        }
        if (years >= 8) return "Senior / Lead";
        if (years >= 3) return "Mid-Level";
        return "Junior / Entry-Level";
    }

    public String generateDetailedFeedback(String resumeText, JobRole role) {
        if (role == null) return "";
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
}
