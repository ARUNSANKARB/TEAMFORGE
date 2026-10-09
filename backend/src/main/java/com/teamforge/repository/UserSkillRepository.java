package com.teamforge.repository;

import com.teamforge.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByStudentProfileId(Long profileId);
    void deleteByStudentProfileIdAndSkillId(Long profileId, Long skillId);
}
