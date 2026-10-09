package com.teamforge.service;

import com.teamforge.dto.AuthRequest;
import com.teamforge.dto.AuthResponse;
import com.teamforge.dto.RegisterRequest;
import com.teamforge.entity.StudentProfile;
import com.teamforge.entity.User;
import com.teamforge.enums.RoleType;
import com.teamforge.exception.BadRequestException;
import com.teamforge.exception.ResourceNotFoundException;
import com.teamforge.repository.StudentProfileRepository;
import com.teamforge.repository.UserRepository;
import com.teamforge.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already in use.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .college(request.getCollege())
                .department(request.getDepartment())
                .year(request.getYear())
                .role(request.getRole() != null ? request.getRole() : RoleType.STUDENT)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        // Auto-create StudentProfile
        StudentProfile profile = StudentProfile.builder()
                .user(savedUser)
                .bio("Engineering student enthusiastic about software projects and innovation.")
                .availabilityHours(15)
                .previousProjectCount(0)
                .preferredTeamSize(4)
                .build();

        studentProfileRepository.save(profile);

        String token = tokenProvider.generateToken(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .college(savedUser.getCollege())
                .department(savedUser.getDepartment())
                .year(savedUser.getYear())
                .role(savedUser.getRole())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = tokenProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .college(user.getCollege())
                .department(user.getDepartment())
                .year(user.getYear())
                .role(user.getRole())
                .build();
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
