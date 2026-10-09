package com.teamforge.dto;

import com.teamforge.enums.ProficiencyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSkillDto {
    private Long id;
    private Long skillId;
    private String skillName;
    private String category;
    private ProficiencyLevel proficiencyLevel;
}
