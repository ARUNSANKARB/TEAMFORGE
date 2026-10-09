# TeamForge: An AI-Assisted Platform for Intelligent Team Formation and Collaborative Innovation in Student Software Projects

> **Engineering Final-Year Project & Conference Paper Implementation**  
> **Authors**: Arun Sankar B, Kamalesh T, Abijay R  
> **Guide**: Dr. S. Muruganandam  
> **Department**: Department of Computer Science and Business Systems, Panimalar Engineering College, Chennai, India  

---

## 🚀 Executive Summary & Core Concept

**TeamForge** is an AI-assisted platform designed to help engineering students form balanced, high-performing software project teams based on multiple factors instead of random assignment or simple similarity matching.

### Key Innovations
- **Constraint-First Pipeline**: Applies hard eligibility filters (mandatory skills, schedule availability, concurrent project limits) before ranking.
- **Skill Complementarity**: Finds teammates who fill critical technical skill gaps (e.g., matching a React frontend specialist with a Java Spring Boot backend team).
- **Transparent Explainability Cards**: Displays "Why recommended?" itemized reasons (skill contributions, availability alignment, and fairness exposure priors).
- **Cold-Start Protection**: Assigns a neutral 50% prior for new students with zero project history to prevent reputation-based exclusion.
- **Real-Time Dynamic Team Health**: Dynamically recalculates overall Team Health Index (Skill Coverage %, Role Coverage %, Experience Balance %, Availability Score %) whenever a candidate joins.

---

## 🛠️ Technology Stack

### Backend
- **Language & Framework**: Java 21 LTS, Spring Boot 3.3.4
- **Security & Auth**: Spring Security 6, JWT (JSON Web Tokens), BCrypt Password Encoder
- **Persistence & ORM**: Spring Data JPA, Hibernate, H2 In-Memory Database (out-of-the-box runnability) with PostgreSQL dialect compatibility & PostgreSQL schema
- **Build Tool**: Apache Maven 3.9

### Frontend
- **Framework & Build**: React 18, Vite 5, JavaScript / JSX
- **Styling**: Tailwind CSS v3, Custom Glassmorphism Theme
- **State & Routing**: React Router v6, Axios API client with Bearer Token interceptor
- **Visualization & Icons**: Recharts (System Analytics & Evaluation Metrics), Lucide React

---

## 📁 Monorepo Structure

```
teamforge/
├── frontend/                  # React + Vite + Tailwind CSS App
│   ├── src/
│   │   ├── components/        # TeamHealthScore, CandidateCard, WhyRecommendedModal, TaskBoard, ProjectCard
│   │   ├── context/           # AuthContext (JWT session management)
│   │   ├── layouts/           # Navbar, Sidebar, DashboardLayout
│   │   ├── pages/             # LandingPage, Dashboard, DiscoverProjects, RecommendationDemo, Tasks, Analytics, Profile, Admin
│   │   └── services/          # Axios API Interceptor
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Spring Boot 3 Java 21 REST Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/teamforge/
│   │   │   │   ├── config/             # DataInitializer (Automatic demo seed data)
│   │   │   │   ├── controller/         # Auth, Profiles, Projects, Teams, Recommendations, Tasks, Analytics, Admin
│   │   │   │   ├── dto/                # Request/Response Data Transfer Objects
│   │   │   │   ├── entity/             # JPA Entities (User, StudentProfile, Skill, Project, Team, Recommendation, Task)
│   │   │   │   ├── recommendation/     # Multi-Factor Recommendation Engine & Scoring Calculator
│   │   │   │   ├── repository/         # Spring Data JPA Repositories
│   │   │   │   ├── security/           # JWT Token Provider, Custom User Details, Security Filter
│   │   │   │   └── service/            # Core Business Logic Services
│   │   │   └── resources/              # application.properties, schema.sql
│   │   └── test/                       # RecommendationEngineTest
│   └── pom.xml
│
├── database/
│   └── schema.sql             # PostgreSQL Relational DDL Schema
├── docs/
│   ├── architecture.md        # Monorepo architecture & component flow
│   ├── api-documentation.md   # REST API endpoint reference
│   ├── recommendation-algorithm.md # Mathematical formulation & scoring model
│   └── database-design.md     # Relational ER diagrams & schema design
└── README.md
```

---

## 🧮 Multi-Factor Scoring Algorithm

The compatibility utility score \( U(i, r) \) between candidate \( i \) and role \( r \) of project \( p \):

$$
U(i, r) = 0.30 \cdot S(i, r) + 0.20 \cdot C(i, r) + 0.15 \cdot R(i, r) + 0.10 \cdot I(i, p) + 0.10 \cdot E(i, p) + 0.05 \cdot A(i, p) + 0.05 \cdot P(i, r) + 0.05 \cdot B(i, T)
$$

### Component Weights
- **Skill Match Score (30%)**: Similarity between candidate skills and project required skills.
- **Skill Complementarity (20%)**: Reward for filling missing technical skill gaps in the current team.
- **Role Compatibility (15%)**: Alignment with declared preferred role and domain.
- **Interest Match (10%)**: Project domain interest overlap.
- **Experience Alignment (10%)**: Project count with neutral prior (50%) for cold-start newcomers.
- **Availability Match (5%)**: Overlapping free hours per week vs required commitment.
- **Preference & Team Balance (10%)**: Work style preference and leadership balance.

---

## 🔑 Demo Login Credentials

The application automatically seeds realistic demo accounts on startup:

| Account Type | Email | Password | Role / Access |
|---|---|---|---|
| **Student (Default)** | `student@teamforge.demo` | `Password123!` | Student Member (Arun Sankar B) |
| **Project Lead** | `leader@teamforge.demo` | `Password123!` | Project Owner (Kamalesh T) |
| **Faculty Admin** | `admin@teamforge.demo` | `Password123!` | Faculty / HOD Admin |

> *Quick-login buttons are pre-configured on the login page (`/login`) for fast live viva demonstration.*

---

## 🚦 How to Run the Application

### 1. Prerequisites
- Java 21 LTS installed (`java -version`)
- Apache Maven 3.8+ installed (`mvn -v`)
- Node.js 18+ and npm installed (`node -v`)

### 2. Running the Spring Boot Backend
```bash
cd backend
mvn clean test        # Run backend unit tests
mvn spring-boot:run   # Start Spring Boot Server on port 8080
```
- **Backend API**: `http://localhost:8080/api`
- **H2 Database Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:teamforgedb`, Username: `sa`, Password: empty)

### 3. Running the React + Vite Frontend
```bash
cd frontend
npm install           # Install frontend dependencies
npm run dev           # Start Vite Dev Server on port 5173
```
- **Frontend App**: `http://localhost:5173`
- **AI Recommendation Demo Screen**: `http://localhost:5173/recommendations/demo`

---

## 📊 Live Viva Demonstration Flow

1. Open `http://localhost:5173` to view the SaaS Landing Page.
2. Click **Sign In** and select **Project Lead** quick-fill button (`leader@teamforge.demo`).
3. Navigate to **AI Match Engine** (`/recommendations/demo`) to view the **Smart Campus Management System** target project.
4. Inspect the **Dynamic Team Health Index** (Skill Coverage, Role Coverage, Experience Balance).
5. Click **"Why recommended?"** on top candidate **Abijay R** (91% match) to inspect the transparent explainability card detailing filled skill gaps.
6. Click **"Add to Team"** — observe the candidate added to the roster and the **Team Health Score dynamically update** in real-time!
7. Navigate to **Tasks Board** (`/tasks`) to manage Kanban cards and discussion comments.
8. Navigate to **Analytics & Research** (`/analytics`) to present conference evaluation metrics (Precision 91.2%, Recall 88.5%, F1-Score 89.8%).
