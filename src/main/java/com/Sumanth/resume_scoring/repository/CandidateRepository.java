package com.Sumanth.resume_scoring.repository;

import com.Sumanth.resume_scoring.model.Candidate;
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

    // SaaS Feature: Paginated and Sorted view by Role (Crucial for large datasets)
    Page<Candidate> findByJobRoleId(Long roleId, Pageable pageable);

    // SaaS Feature: Global Search (Search by name or email)
    @Query("SELECT c FROM Candidate c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Candidate> searchCandidates(@Param("query") String query, Pageable pageable);

    // UI Analytics: Get counts for dashboard "Funnel" charts
    @Query("SELECT c.status, COUNT(c) FROM Candidate c GROUP BY c.status")
    List<Object[]> getStatusCounts();

    // Advanced Ranking: Ties are broken by the most recently updated candidate
    List<Candidate> findByJobRoleIdOrderByTotalScoreDescUpdatedAtDesc(Long roleId);
}