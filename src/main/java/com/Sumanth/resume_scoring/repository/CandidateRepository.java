package com.Sumanth.resume_scoring.repository;

import com.Sumanth.resume_scoring.entity.Candidate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    Optional<Candidate> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<Candidate> findByJobRoleId(Long roleId, Pageable pageable);

    @Query("SELECT c FROM Candidate c WHERE " +
           "(:roleId IS NULL OR c.jobRole.id = :roleId) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:minScore IS NULL OR c.totalScore >= :minScore) AND " +
           "(:keyword IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Candidate> searchCandidates(
            @Param("roleId") Long roleId,
            @Param("status") String status,
            @Param("minScore") Integer minScore,
            @Param("keyword") String keyword);

    @Query("SELECT c.status, COUNT(c) FROM Candidate c GROUP BY c.status")
    List<Object[]> getStatusCounts();

    // Match this name exactly with the service call
    List<Candidate> findByJobRoleIdOrderByTotalScoreDesc(Long roleId);
}