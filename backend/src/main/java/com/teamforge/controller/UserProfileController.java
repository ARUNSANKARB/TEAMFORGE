package com.teamforge.controller;

import com.teamforge.dto.ApiResponse;
import com.teamforge.dto.UpdateProfileRequest;
import com.teamforge.dto.UserProfileDto;
import com.teamforge.entity.User;
import com.teamforge.enums.ProficiencyLevel;
import com.teamforge.service.AuthService;
import com.teamforge.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> getMyProfile(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        UserProfileDto profile = userProfileService.getProfileByUserId(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfileByUserId(@PathVariable Long userId) {
        UserProfileDto profile = userProfileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(Authentication authentication,
                                                                      @RequestBody UpdateProfileRequest request) {
        User user = authService.getCurrentUser(authentication.getName());
        UserProfileDto updated = userProfileService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @PostMapping("/me/skills")
    public ResponseEntity<ApiResponse<UserProfileDto>> addSkill(Authentication authentication,
                                                                 @RequestParam Long skillId,
                                                                 @RequestParam(required = false) ProficiencyLevel level) {
        User user = authService.getCurrentUser(authentication.getName());
        UserProfileDto updated = userProfileService.addSkillToProfile(user.getId(), skillId, level);
        return ResponseEntity.ok(ApiResponse.ok("Skill added to profile", updated));
    }

    @DeleteMapping("/me/skills/{skillId}")
    public ResponseEntity<ApiResponse<UserProfileDto>> removeSkill(Authentication authentication,
                                                                    @PathVariable Long skillId) {
        User user = authService.getCurrentUser(authentication.getName());
        UserProfileDto updated = userProfileService.removeSkillFromProfile(user.getId(), skillId);
        return ResponseEntity.ok(ApiResponse.ok("Skill removed from profile", updated));
    }
}
