package com.Sumanth.resume_scoring.repository;

import com.Sumanth.resume_scoring.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    Optional<Candidate> findByEmail(String email);

    List<Candidate> findByJobRoleIdOrderByTotalScoreDesc(Long roleId);

    List<Candidate> findByStatus(String status);

    @Query("SELECT c FROM Candidate c WHERE c.jobRole.id = :roleId ORDER BY c.totalScore DESC")
    List<Candidate> findTopCandidatesByRole(Long roleId);

    boolean existsByEmail(String email);
}