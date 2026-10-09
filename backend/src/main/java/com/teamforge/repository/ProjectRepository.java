package com.teamforge.repository;

import com.teamforge.entity.Project;
import com.teamforge.enums.DifficultyLevel;
import com.teamforge.enums.ProjectDomain;
import com.teamforge.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwnerId(Long ownerId);
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByDomain(ProjectDomain domain);

    @Query("SELECT p FROM Project p WHERE " +
           "(:domain IS NULL OR p.domain = :domain) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:difficulty IS NULL OR p.difficulty = :difficulty) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Project> filterProjects(@Param("domain") ProjectDomain domain,
                                @Param("status") ProjectStatus status,
                                @Param("difficulty") DifficultyLevel difficulty,
                                @Param("search") String search);
}
