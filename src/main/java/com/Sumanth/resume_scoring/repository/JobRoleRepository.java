package com.Sumanth.resume_scoring.repository;

import com.Sumanth.resume_scoring.model.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRoleRepository extends JpaRepository<JobRole, Long> {
    Optional<JobRole> findByRoleName(String roleName);
}