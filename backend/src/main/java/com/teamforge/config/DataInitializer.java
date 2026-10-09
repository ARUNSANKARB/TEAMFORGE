package com.teamforge.config;

import com.teamforge.entity.*;
import com.teamforge.enums.*;
import com.teamforge.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;
    private final ActivityRepository activityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        // 1. SEED SKILLS TAXONOMY
        Map<String, Skill> skillMap = new HashMap<>();
        Object[][] rawSkills = {
            {"Java", SkillCategory.BACKEND},
            {"Spring Boot", SkillCategory.BACKEND},
            {"Python", SkillCategory.AI_ML},
            {"Machine Learning", SkillCategory.AI_ML},
            {"React", SkillCategory.FRONTEND},
            {"Node.js", SkillCategory.BACKEND},
            {"JavaScript", SkillCategory.FRONTEND},
            {"TypeScript", SkillCategory.FRONTEND},
            {"SQL", SkillCategory.DATABASE},
            {"PostgreSQL", SkillCategory.DATABASE},
            {"MongoDB", SkillCategory.DATABASE},
            {"UI/UX", SkillCategory.UI_UX},
            {"Cloud / AWS", SkillCategory.DEVOPS},
            {"DevOps & Docker", SkillCategory.DEVOPS},
            {"Testing / JUnit", SkillCategory.TESTING},
            {"Git / GitHub", SkillCategory.DEVOPS},
            {"Android / Kotlin", SkillCategory.MOBILE},
            {"Flutter", SkillCategory.MOBILE},
            {"FastAPI", SkillCategory.BACKEND},
            {"PyTorch / TensorFlow", SkillCategory.AI_ML},
            {"Cybersecurity", SkillCategory.OTHER},
            {"Blockchain / Solidity", SkillCategory.OTHER},
            {"Next.js", SkillCategory.FRONTEND},
            {"Tailwind CSS", SkillCategory.FRONTEND},
            {"IoT / Embedded C", SkillCategory.OTHER}
        };

        for (Object[] raw : rawSkills) {
            String name = (String) raw[0];
            SkillCategory cat = (SkillCategory) raw[1];
            Skill skill = skillRepository.save(Skill.builder().name(name).category(cat).build());
            skillMap.put(name, skill);
        }

        String encodedPassword = passwordEncoder.encode("Password123!");

        // 2. SEED DEMO & STUDENT USERS (20+ students)
        User demoStudentUser = userRepository.save(User.builder()
                .fullName("Arun Sankar B")
                .email("student@teamforge.demo")
                .password(encodedPassword)
                .college("Panimalar Engineering College")
                .department("Computer Science & Business Systems")
                .year("Final Year (IV)")
                .role(RoleType.STUDENT)
                .enabled(true)
                .build());

        User demoAdminUser = userRepository.save(User.builder()
                .fullName("Dr. S. Muruganandam (Admin)")
                .email("admin@teamforge.demo")
                .password(encodedPassword)
                .college("Panimalar Engineering College")
                .department("Computer Science & Business Systems")
                .year("Faculty / HOD")
                .role(RoleType.ADMIN)
                .enabled(true)
                .build());

        User demoLeaderUser = userRepository.save(User.builder()
                .fullName("Kamalesh T")
                .email("leader@teamforge.demo")
                .password(encodedPassword)
                .college("Panimalar Engineering College")
                .department("Computer Science & Business Systems")
                .year("Final Year (IV)")
                .role(RoleType.PROJECT_OWNER)
                .enabled(true)
                .build());

        User userAbijay = userRepository.save(User.builder()
                .fullName("Abijay R")
                .email("abijay@teamforge.demo")
                .password(encodedPassword)
                .college("Panimalar Engineering College")
                .department("Computer Science & Business Systems")
                .year("Final Year (IV)")
                .role(RoleType.STUDENT)
                .enabled(true)
                .build());

        // Create additional 16 realistic student users
        String[] studentNames = {
            "Priya Sharma", "Rahul Verma", "Ananya Sundaram", "Karthik Raja",
            "Deepika R", "Siddharth Nair", "Meera Krishnan", "Vignesh Kumar",
            "Swetha Subramanian", "Aravind Menon", "Nivetha Mohan", "Gautham Prakash",
            "Kavya Iyer", "Dinesh Karthik", "Sowmya Venkat", "Harish Raghavan"
        };

        List<User> additionalStudents = new ArrayList<>();
        for (int i = 0; i < studentNames.length; i++) {
            String name = studentNames[i];
            String email = name.toLowerCase().replace(" ", ".") + "@teamforge.demo";
            User u = userRepository.save(User.builder()
                    .fullName(name)
                    .email(email)
                    .password(encodedPassword)
                    .college("Panimalar Engineering College")
                    .department(i % 2 == 0 ? "Computer Science & Engineering" : "Artificial Intelligence & Data Science")
                    .year("Final Year (IV)")
                    .role(RoleType.STUDENT)
                    .enabled(true)
                    .build());
            additionalStudents.add(u);
        }

        // 3. SEED STUDENT PROFILES & SKILLS
        // Profile for Arun Sankar B
        StudentProfile arunProfile = StudentProfile.builder()
                .user(demoStudentUser)
                .bio("Full-stack enthusiast focused on Java Spring Boot, React, and AI recommendation systems.")
                .preferredRole("Backend Developer / Lead")
                .secondaryRole("Full-Stack Developer")
                .projectInterests("AI/ML, Web Development, Cloud")
                .availabilityHours(20)
                .previousProjectCount(3)
                .leadershipExperience(true)
                .preferredTeamSize(4)
                .githubUrl("https://github.com/arunsankar")
                .linkedinUrl("https://linkedin.com/in/arunsankar")
                .build();
        arunProfile.getUserSkills().add(UserSkill.builder().studentProfile(arunProfile).skill(skillMap.get("Java")).proficiencyLevel(ProficiencyLevel.EXPERT).build());
        arunProfile.getUserSkills().add(UserSkill.builder().studentProfile(arunProfile).skill(skillMap.get("Spring Boot")).proficiencyLevel(ProficiencyLevel.ADVANCED).build());
        arunProfile.getUserSkills().add(UserSkill.builder().studentProfile(arunProfile).skill(skillMap.get("SQL")).proficiencyLevel(ProficiencyLevel.ADVANCED).build());
        arunProfile.getUserSkills().add(UserSkill.builder().studentProfile(arunProfile).skill(skillMap.get("PostgreSQL")).proficiencyLevel(ProficiencyLevel.ADVANCED).build());
        studentProfileRepository.save(arunProfile);

        // Profile for Kamalesh T
        StudentProfile kamaleshProfile = StudentProfile.builder()
                .user(demoLeaderUser)
                .bio("Passionate project manager and AI researcher building smart campus solutions.")
                .preferredRole("Project Lead / Architect")
                .secondaryRole("Machine Learning Engineer")
                .projectInterests("AI/ML, Data Science, Cloud")
                .availabilityHours(18)
                .previousProjectCount(4)
                .leadershipExperience(true)
                .preferredTeamSize(4)
                .githubUrl("https://github.com/kamalesh")
                .linkedinUrl("https://linkedin.com/in/kamalesh")
                .build();
        kamaleshProfile.getUserSkills().add(UserSkill.builder().studentProfile(kamaleshProfile).skill(skillMap.get("Python")).proficiencyLevel(ProficiencyLevel.EXPERT).build());
        kamaleshProfile.getUserSkills().add(UserSkill.builder().studentProfile(kamaleshProfile).skill(skillMap.get("Machine Learning")).proficiencyLevel(ProficiencyLevel.ADVANCED).build());
        kamaleshProfile.getUserSkills().add(UserSkill.builder().studentProfile(kamaleshProfile).skill(skillMap.get("PyTorch / TensorFlow")).proficiencyLevel(ProficiencyLevel.ADVANCED).build());
        studentProfileRepository.save(kamaleshProfile);

        // Profile for Abijay R
        StudentProfile abijayProfile = StudentProfile.builder()
                .user(userAbijay)
                .bio("Frontend specialist and UI designer obsessed with smooth modern interfaces.")
                .preferredRole("Frontend Developer")
                .secondaryRole("UI/UX Designer")
                .projectInterests("Web Development, Mobile Development, UI/UX")
                .availabilityHours(20)
                .previousProjectCount(3)
                .leadershipExperience(false)
                .preferredTeamSize(4)
                .githubUrl("https://github.com/abijay")
                .linkedinUrl("https://linkedin.com/in/abijay")
                .build();
        abijayProfile.getUserSkills().add(UserSkill.builder().studentProfile(abijayProfile).skill(skillMap.get("React")).proficiencyLevel(ProficiencyLevel.EXPERT).build());
        abijayProfile.getUserSkills().add(UserSkill.builder().studentProfile(abijayProfile).skill(skillMap.get("JavaScript")).proficiencyLevel(ProficiencyLevel.ADVANCED).build());
        abijayProfile.getUserSkills().add(UserSkill.builder().studentProfile(abijayProfile).skill(skillMap.get("UI/UX")).proficiencyLevel(ProficiencyLevel.ADVANCED).build());
        abijayProfile.getUserSkills().add(UserSkill.builder().studentProfile(abijayProfile).skill(skillMap.get("Tailwind CSS")).proficiencyLevel(ProficiencyLevel.EXPERT).build());
        studentProfileRepository.save(abijayProfile);

        // Profiles for remaining 16 students
        ProficiencyLevel[] levels = ProficiencyLevel.values();
        for (int i = 0; i < additionalStudents.size(); i++) {
            User std = additionalStudents.get(i);
            StudentProfile p = StudentProfile.builder()
                    .user(std)
                    .bio("Computer Science final-year student interested in innovative team projects.")
                    .preferredRole(i % 3 == 0 ? "Frontend Developer" : (i % 3 == 1 ? "Backend Developer" : "Data Specialist"))
                    .secondaryRole("QA / Tester")
                    .projectInterests(i % 2 == 0 ? "AI/ML, Web Development" : "Cloud, Cybersecurity")
                    .availabilityHours(15 + (i % 6))
                    .previousProjectCount(i % 4) // Some 0 count for cold-start evaluation
                    .leadershipExperience(i % 5 == 0)
                    .preferredTeamSize(4)
                    .build();

            // Assign 3 skills to each student
            Skill s1 = skillMap.getOrDefault("Java", skillMap.values().iterator().next());
            Skill s2 = skillMap.getOrDefault("React", skillMap.values().iterator().next());
            Skill s3 = skillMap.getOrDefault("Python", skillMap.values().iterator().next());

            if (i % 4 == 0) {
                s1 = skillMap.getOrDefault("React", s1);
                s2 = skillMap.getOrDefault("JavaScript", s2);
                s3 = skillMap.getOrDefault("UI/UX", s3);
            } else if (i % 4 == 1) {
                s1 = skillMap.getOrDefault("Python", s1);
                s2 = skillMap.getOrDefault("Machine Learning", s2);
                s3 = skillMap.getOrDefault("FastAPI", s3);
            } else if (i % 4 == 2) {
                s1 = skillMap.getOrDefault("Node.js", s1);
                s2 = skillMap.getOrDefault("MongoDB", s2);
                s3 = skillMap.getOrDefault("SQL", s3);
            }

            p.getUserSkills().add(UserSkill.builder().studentProfile(p).skill(s1).proficiencyLevel(levels[1 + (i % 3)]).build());
            p.getUserSkills().add(UserSkill.builder().studentProfile(p).skill(s2).proficiencyLevel(levels[1 + ((i + 1) % 3)]).build());
            p.getUserSkills().add(UserSkill.builder().studentProfile(p).skill(s3).proficiencyLevel(levels[1 + ((i + 2) % 3)]).build());
            studentProfileRepository.save(p);
        }

        // 4. SEED PROJECTS & TEAMS
        // Project 1: Smart Campus Management System (Highlight Demo Project)
        Project p1 = Project.builder()
                .owner(demoLeaderUser)
                .name("Smart Campus Management System")
                .description("An intelligent campus portal integrating automated attendance, room reservation, AI student query resolution, and lab resource tracking.")
                .problemStatement("Traditional college management portals lack intelligent resource allocation and predictive student assistance.")
                .domain(ProjectDomain.WEB_DEV)
                .status(ProjectStatus.RECRUITING)
                .difficulty(DifficultyLevel.INTERMEDIATE)
                .preferredTeamSize(4)
                .currentTeamSize(2)
                .weeklyCommitmentHours(15)
                .deadline(LocalDate.now().plusMonths(3))
                .build();

        p1.getRequiredSkills().add(ProjectSkill.builder().project(p1).skill(skillMap.get("Java")).isMandatory(true).build());
        p1.getRequiredSkills().add(ProjectSkill.builder().project(p1).skill(skillMap.get("Spring Boot")).isMandatory(true).build());
        p1.getRequiredSkills().add(ProjectSkill.builder().project(p1).skill(skillMap.get("React")).isMandatory(true).build());
        p1.getRequiredSkills().add(ProjectSkill.builder().project(p1).skill(skillMap.get("PostgreSQL")).isMandatory(true).build());
        p1.getRequiredSkills().add(ProjectSkill.builder().project(p1).skill(skillMap.get("Machine Learning")).isMandatory(false).build());

        Project savedP1 = projectRepository.save(p1);

        Team t1 = teamRepository.save(Team.builder()
                .project(savedP1)
                .name("Smart Campus Innovators")
                .teamLeader(demoLeaderUser)
                .status(TeamStatus.RECRUITING)
                .build());

        teamMemberRepository.save(TeamMember.builder().team(t1).user(demoLeaderUser).assignedRole("Project Leader / AI Lead").build());
        teamMemberRepository.save(TeamMember.builder().team(t1).user(userAbijay).assignedRole("Frontend Lead").build());

        // Project 2: AI Campus Water Forecasting & Sustainability
        Project p2 = projectRepository.save(Project.builder()
                .owner(demoStudentUser)
                .name("AI Campus Water & Energy Forecasting")
                .description("IoT sensors and time-series ML models to predict daily campus water consumption and optimize reservoir distribution.")
                .problemStatement("Campus water scarcity requires automated consumption forecasting to prevent shortage during peak academic hours.")
                .domain(ProjectDomain.AI_ML)
                .status(ProjectStatus.RECRUITING)
                .difficulty(DifficultyLevel.ADVANCED)
                .preferredTeamSize(4)
                .currentTeamSize(1)
                .weeklyCommitmentHours(18)
                .deadline(LocalDate.now().plusMonths(4))
                .build());

        p2.getRequiredSkills().add(ProjectSkill.builder().project(p2).skill(skillMap.get("Python")).isMandatory(true).build());
        p2.getRequiredSkills().add(ProjectSkill.builder().project(p2).skill(skillMap.get("Machine Learning")).isMandatory(true).build());
        p2.getRequiredSkills().add(ProjectSkill.builder().project(p2).skill(skillMap.get("React")).isMandatory(true).build());
        p2.getRequiredSkills().add(ProjectSkill.builder().project(p2).skill(skillMap.get("PostgreSQL")).isMandatory(false).build());
        projectRepository.save(p2);

        Team t2 = teamRepository.save(Team.builder().project(p2).name("HydroAI Team").teamLeader(demoStudentUser).status(TeamStatus.RECRUITING).build());
        teamMemberRepository.save(TeamMember.builder().team(t2).user(demoStudentUser).assignedRole("System Architect").build());

        // Create 6 more projects across domains
        String[][] additionalProjData = {
            {"Autonomous Drone Traffic Monitoring", "Computer vision model detecting traffic congestion on campus arterial roads.", "AI_ML", "ADVANCED"},
            {"Decentralized Student Credentials Verification", "Blockchain-backed verification for academic certificates and hackathon awards.", "BLOCKCHAIN", "ADVANCED"},
            {"Healthcare Telemedicine & Remote Triage", "AI-assisted symptom checker and appointment scheduling for campus clinic.", "HEALTHCARE", "INTERMEDIATE"},
            {"FinTech Micro-Loan Platform for Students", "Peer-to-peer micro-lending app with credit score risk calculation.", "FINTECH", "INTERMEDIATE"},
            {"IoT Smart Greenhouse & Agriculture", "Automated soil moisture monitoring and smart drip irrigation system.", "IOT", "BEGINNER"},
            {"Green Campus Energy Optimization Dashboard", "Real-time energy dashboard tracking hostel electricity consumption.", "SUSTAINABILITY", "BEGINNER"}
        };

        for (int i = 0; i < additionalProjData.length; i++) {
            User owner = additionalStudents.get(i);
            String title = additionalProjData[i][0];
            String desc = additionalProjData[i][1];
            ProjectDomain dom = ProjectDomain.valueOf(additionalProjData[i][2]);
            DifficultyLevel diff = DifficultyLevel.valueOf(additionalProjData[i][3]);

            Project proj = Project.builder()
                    .owner(owner)
                    .name(title)
                    .description(desc)
                    .problemStatement("Addressing critical engineering challenge through collaborative software implementation.")
                    .domain(dom)
                    .status(ProjectStatus.RECRUITING)
                    .difficulty(diff)
                    .preferredTeamSize(4)
                    .currentTeamSize(1)
                    .weeklyCommitmentHours(15)
                    .deadline(LocalDate.now().plusMonths(3 + i))
                    .build();

            proj.getRequiredSkills().add(ProjectSkill.builder().project(proj).skill(skillMap.get("Python")).isMandatory(true).build());
            proj.getRequiredSkills().add(ProjectSkill.builder().project(proj).skill(skillMap.get("Java")).isMandatory(false).build());
            Project savedProj = projectRepository.save(proj);

            Team tm = teamRepository.save(Team.builder().project(savedProj).name(title + " Team").teamLeader(owner).status(TeamStatus.RECRUITING).build());
            teamMemberRepository.save(TeamMember.builder().team(tm).user(owner).assignedRole("Project Owner").build());
        }

        // 5. SEED TASKS FOR SMART CAMPUS PROJECT
        taskRepository.save(Task.builder()
                .project(savedP1)
                .team(t1)
                .title("Design Database ER Diagram & Relational Schema")
                .description("Map out entities for Users, Attendance Logs, Room Bookings, and Labs.")
                .status(TaskStatus.DONE)
                .priority(TaskPriority.HIGH)
                .assignee(demoLeaderUser)
                .dueDate(LocalDate.now().minusDays(2))
                .build());

        taskRepository.save(Task.builder()
                .project(savedP1)
                .team(t1)
                .title("Implement React Vite Dashboard & Navigation Layout")
                .description("Create sleek sidebar, header, and active project stats cards.")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.CRITICAL)
                .assignee(userAbijay)
                .dueDate(LocalDate.now().plusDays(5))
                .build());

        taskRepository.save(Task.builder()
                .project(savedP1)
                .team(t1)
                .title("Integrate Spring Boot JWT Authentication & Security Filter")
                .description("Secure REST APIs with JWT tokens and BCrypt password encryption.")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .assignee(demoStudentUser)
                .dueDate(LocalDate.now().plusDays(7))
                .build());

        taskRepository.save(Task.builder()
                .project(savedP1)
                .team(t1)
                .title("Configure Multi-Factor AI Team Recommendation Pipeline")
                .description("Run compatibility scoring evaluating skill match, complementarity, and role overlap.")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.CRITICAL)
                .assignee(demoLeaderUser)
                .dueDate(LocalDate.now().plusDays(10))
                .build());

        // 6. SEED NOTIFICATIONS & ACTIVITIES
        notificationRepository.save(Notification.builder()
                .user(demoStudentUser)
                .title("Team Recommendation Available")
                .message("You have 5 high-compatibility team recommendations for 'Smart Campus Management System'.")
                .type("RECOMMENDATION")
                .isRead(false)
                .build());

        activityRepository.save(Activity.builder()
                .project(savedP1)
                .user(demoLeaderUser)
                .activityType("PROJECT_CREATED")
                .description("Kamalesh T created project 'Smart Campus Management System'")
                .build());

        activityRepository.save(Activity.builder()
                .project(savedP1)
                .user(userAbijay)
                .activityType("MEMBER_JOINED")
                .description("Abijay R joined team 'Smart Campus Innovators' as Frontend Lead")
                .build());
    }
}
