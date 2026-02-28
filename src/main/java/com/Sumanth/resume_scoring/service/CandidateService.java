package com.Sumanth.resume_scoring.service;

import com.Sumanth.resume_scoring.dto.CandidateMapper;
import com.Sumanth.resume_scoring.dto.response.CandidateDetailDTO;
import com.Sumanth.resume_scoring.dto.response.CandidateResponseDTO;
import com.Sumanth.resume_scoring.entity.Candidate;
import com.Sumanth.resume_scoring.entity.JobRole;
import com.Sumanth.resume_scoring.exception.ResourceNotFoundException;
import com.Sumanth.resume_scoring.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobRoleService jobRoleService;

    @Autowired
    private PdfExtractionService pdfExtractionService;

    @Autowired
    private ScoringEngineService scoringEngineService;

    @Autowired
    private FileStorageService fileStorageService;

    public boolean emailExists(String email) {
        return candidateRepository.existsByEmail(email);
    }

    @Transactional
    public Candidate saveAndProcessCandidate(MultipartFile file, String name, String email, String phone, Long roleId) throws Exception {
        JobRole role = jobRoleService.getRoleById(roleId);

        String resumeText = pdfExtractionService.extractTextFromPDF(file);
        String filePath = fileStorageService.saveFile(file);
        
        int score = scoringEngineService.calculateAdvancedScore(resumeText, role);
        String experienceLevel = scoringEngineService.detectExperienceLevel(resumeText);
        String feedback = scoringEngineService.generateDetailedFeedback(resumeText, role);

        Candidate candidate = new Candidate();
        candidate.setName(name);
        candidate.setEmail(email);
        candidate.setPhoneNumber(phone);
        candidate.setFileName(file.getOriginalFilename());
        candidate.setFilePath(filePath);
        candidate.setResumeText(resumeText);
        candidate.setTotalScore(score);
        candidate.setFeedback(feedback);
        candidate.setJobRole(role);
        candidate.setExperienceLevel(experienceLevel);
        candidate.setStatus("NEW");

        Candidate savedCandidate = candidateRepository.save(candidate);
        updateRankings(roleId);
        return savedCandidate;
    }

    @Transactional
    public void updateRankings(Long roleId) {
        List<Candidate> candidates = candidateRepository.findByJobRoleIdOrderByTotalScoreDesc(roleId);
        for (int i = 0; i < candidates.size(); i++) {
            candidates.get(i).setRankInRole(i + 1);
        }
        candidateRepository.saveAll(candidates);
    }

    public List<CandidateResponseDTO> searchCandidates(Long roleId, String status, Integer minScore, String keyword) {
        return candidateRepository.searchCandidates(roleId, status, minScore, keyword).stream()
                .map(CandidateMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<CandidateResponseDTO> getAllCandidates() {
        return candidateRepository.findAll().stream()
                .map(CandidateMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<CandidateResponseDTO> getCandidatesByRole(Long roleId) {
        return candidateRepository.findByJobRoleIdOrderByTotalScoreDesc(roleId).stream()
                .map(CandidateMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public CandidateDetailDTO getCandidateDetail(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate with ID " + id + " not found"));
        return CandidateMapper.toDetailDto(candidate);
    }

    @Transactional
    public CandidateResponseDTO updateCandidateStatus(Long id, String status) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate with ID " + id + " not found"));
        candidate.setStatus(status);
        return CandidateMapper.toResponseDto(candidateRepository.save(candidate));
    }

    @Transactional
    public void deleteCandidate(Long id) {
        if (!candidateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Candidate with ID " + id + " not found");
        }
        candidateRepository.deleteById(id);
    }

    public String exportCandidatesToCsv() {
        List<Candidate> candidates = candidateRepository.findAll();
        StringBuilder csv = new StringBuilder("ID,Name,Email,Role,Score,Status,Experience\n");
        for (Candidate c : candidates) {
            String roleName = c.getJobRole() != null ? c.getJobRole().getRoleName() : "N/A";
            csv.append(c.getId()).append(",")
               .append(c.getName()).append(",")
               .append(c.getEmail()).append(",")
               .append(roleName).append(",")
               .append(c.getTotalScore()).append(",")
               .append(c.getStatus()).append(",")
               .append(c.getExperienceLevel()).append("\n");
        }
        return csv.toString();
    }

    @Transactional
    public CandidateResponseDTO reanalyzeCandidate(Long id) throws Exception {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate with ID " + id + " not found"));
        
        JobRole role = candidate.getJobRole();
        if (role == null) throw new IllegalArgumentException("Cannot reanalyze candidate without a job role");

        int score = scoringEngineService.calculateAdvancedScore(candidate.getResumeText(), role);
        String experienceLevel = scoringEngineService.detectExperienceLevel(candidate.getResumeText());
        String feedback = scoringEngineService.generateDetailedFeedback(candidate.getResumeText(), role);

        candidate.setTotalScore(score);
        candidate.setExperienceLevel(experienceLevel);
        candidate.setFeedback(feedback);

        candidate = candidateRepository.save(candidate);
        updateRankings(role.getId());

        return CandidateMapper.toResponseDto(candidate);
    }
}
