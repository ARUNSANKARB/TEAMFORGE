package com.teamforge.service;

import com.teamforge.dto.UpdateProfileRequest;
import com.teamforge.dto.UserProfileDto;
import com.teamforge.dto.UserSkillDto;
import com.teamforge.entity.Skill;
import com.teamforge.entity.StudentProfile;
import com.teamforge.entity.User;
import com.teamforge.entity.UserSkill;
import com.teamforge.enums.ProficiencyLevel;
import com.teamforge.exception.ResourceNotFoundException;
import com.teamforge.repository.SkillRepository;
import com.teamforge.repository.StudentProfileRepository;
import com.teamforge.repository.UserRepository;
import com.teamforge.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;

    public UserProfileDto getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        StudentProfile profile = studentProfileRepository.findByUser(user)
                .orElseGet(() -> studentProfileRepository.save(StudentProfile.builder().user(user).build()));

        return mapToProfileDto(profile);
    }

    @Transactional
    public UserProfileDto updateProfile(Long userId, UpdateProfileRequest request) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));

        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getProfilePhoto() != null) profile.setProfilePhoto(request.getProfilePhoto());
        if (request.getPreferredRole() != null) profile.setPreferredRole(request.getPreferredRole());
        if (request.getSecondaryRole() != null) profile.setSecondaryRole(request.getSecondaryRole());
        if (request.getProjectInterests() != null) profile.setProjectInterests(request.getProjectInterests());
        if (request.getAvailabilityHours() != null) profile.setAvailabilityHours(request.getAvailabilityHours());
        if (request.getPreviousProjectCount() != null) profile.setPreviousProjectCount(request.getPreviousProjectCount());
        if (request.getLeadershipExperience() != null) profile.setLeadershipExperience(request.getLeadershipExperience());
        if (request.getPreferredTeamSize() != null) profile.setPreferredTeamSize(request.getPreferredTeamSize());
        if (request.getCommunicationPreference() != null) profile.setCommunicationPreference(request.getCommunicationPreference());
        if (request.getWorkPreference() != null) profile.setWorkPreference(request.getWorkPreference());
        if (request.getGithubUrl() != null) profile.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getPortfolioUrl() != null) profile.setPortfolioUrl(request.getPortfolioUrl());

        StudentProfile saved = studentProfileRepository.save(profile);
        return mapToProfileDto(saved);
    }

    @Transactional
    public UserProfileDto addSkillToProfile(Long userId, Long skillId, ProficiencyLevel proficiencyLevel) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));

        // Check if skill already exists in profile
        profile.getUserSkills().removeIf(us -> us.getSkill().getId().equals(skillId));

        UserSkill userSkill = UserSkill.builder()
                .studentProfile(profile)
                .skill(skill)
                .proficiencyLevel(proficiencyLevel != null ? proficiencyLevel : ProficiencyLevel.INTERMEDIATE)
                .build();

        profile.getUserSkills().add(userSkill);
        StudentProfile saved = studentProfileRepository.save(profile);
        return mapToProfileDto(saved);
    }

    @Transactional
    public UserProfileDto removeSkillFromProfile(Long userId, Long skillId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + userId));

        profile.getUserSkills().removeIf(us -> us.getSkill().getId().equals(skillId));
        StudentProfile saved = studentProfileRepository.save(profile);
        return mapToProfileDto(saved);
    }

    public UserProfileDto mapToProfileDto(StudentProfile profile) {
        User user = profile.getUser();
        List<UserSkillDto> skillDtos = profile.getUserSkills() == null ? Collections.emptyList() :
                profile.getUserSkills().stream()
                        .map(us -> UserSkillDto.builder()
                                .id(us.getId())
                                .skillId(us.getSkill().getId())
                                .skillName(us.getSkill().getName())
                                .category(us.getSkill().getCategory().name())
                                .proficiencyLevel(us.getProficiencyLevel())
                                .build())
                        .toList();

        return UserProfileDto.builder()
                .id(profile.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .college(user.getCollege())
                .department(user.getDepartment())
                .year(user.getYear())
                .role(user.getRole())
                .bio(profile.getBio())
                .profilePhoto(profile.getProfilePhoto())
                .preferredRole(profile.getPreferredRole())
                .secondaryRole(profile.getSecondaryRole())
                .projectInterests(profile.getProjectInterests())
                .availabilityHours(profile.getAvailabilityHours())
                .previousProjectCount(profile.getPreviousProjectCount())
                .leadershipExperience(profile.getLeadershipExperience())
                .preferredTeamSize(profile.getPreferredTeamSize())
                .communicationPreference(profile.getCommunicationPreference())
                .workPreference(profile.getWorkPreference())
                .githubUrl(profile.getGithubUrl())
                .linkedinUrl(profile.getLinkedinUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .skills(skillDtos)
                .build();
    }
}
