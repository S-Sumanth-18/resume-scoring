package com.Sumanth.resume_scoring.repository;

import com.Sumanth.resume_scoring.entity.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRoleRepository extends JpaRepository<JobRole, Long> {
    
    Optional<JobRole> findByRoleName(String roleName);

    // SaaS Feature: Fetch only active roles for the dropdown in the React frontend
    List<JobRole> findByIsActiveTrue();

    // Performance Optimization: Fetches Role and its Skills in a single database hit
    @Query("SELECT j FROM JobRole j LEFT JOIN FETCH j.requiredSkills WHERE j.id = :id")
    Optional<JobRole> findByIdWithSkills(@Param("id") Long id);

    // Dashboard Analytics: Returns role names and count of candidates per role
    @Query("SELECT j.roleName, COUNT(c) FROM JobRole j LEFT JOIN Candidate c ON c.jobRole.id = j.id GROUP BY j.roleName")
    List<Object[]> getCandidateCountByRole();
}