package com.teamforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSkillDto {
    private Long id;
    private Long skillId;
    private String skillName;
    private String category;
    private boolean isMandatory;
}
