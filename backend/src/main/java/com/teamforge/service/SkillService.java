package com.teamforge.service;

import com.teamforge.dto.SkillDto;
import com.teamforge.entity.Skill;
import com.teamforge.enums.SkillCategory;
import com.teamforge.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(this::mapToDto)
                .toList();
    }

    public List<SkillDto> getSkillsByCategory(SkillCategory category) {
        return skillRepository.findByCategory(category).stream()
                .map(this::mapToDto)
                .toList();
    }

    public SkillDto createSkill(String name, SkillCategory category) {
        Skill skill = skillRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> skillRepository.save(Skill.builder()
                        .name(name)
                        .category(category != null ? category : SkillCategory.OTHER)
                        .build()));
        return mapToDto(skill);
    }

    private SkillDto mapToDto(Skill skill) {
        return SkillDto.builder()
                .id(skill.getId())
                .name(skill.getName())
                .category(skill.getCategory())
                .build();
    }
}
