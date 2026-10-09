package com.teamforge.controller;

import com.teamforge.dto.ApiResponse;
import com.teamforge.dto.SkillDto;
import com.teamforge.enums.SkillCategory;
import com.teamforge.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillDto>>> getAllSkills(@RequestParam(required = false) SkillCategory category) {
        List<SkillDto> skills = (category != null) ? skillService.getSkillsByCategory(category) : skillService.getAllSkills();
        return ResponseEntity.ok(ApiResponse.ok(skills));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SkillDto>> createSkill(@RequestParam String name,
                                                              @RequestParam(required = false) SkillCategory category) {
        SkillDto skill = skillService.createSkill(name, category);
        return ResponseEntity.ok(ApiResponse.ok("Skill created", skill));
    }
}
