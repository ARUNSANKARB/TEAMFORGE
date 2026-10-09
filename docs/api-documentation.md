# TeamForge REST API Documentation

## Auth Endpoints
- `POST /api/auth/register`: Register a new user account.
- `POST /api/auth/login`: Authenticate user and receive JWT access token.
- `GET /api/auth/me`: Get current authenticated user profile.

## User & Profile Endpoints
- `GET /api/profiles/me`: Fetch full student profile with skills.
- `PUT /api/profiles/me`: Update student profile details.
- `POST /api/profiles/me/skills`: Add/update technical skills.
- `DELETE /api/profiles/me/skills/{skillId}`: Remove skill from profile.

## Skill Endpoints
- `GET /api/skills`: List all system skills by category.
- `POST /api/skills`: Admin add new skill to taxonomy.

## Project Endpoints
- `GET /api/projects`: Search and filter projects (domain, status, skill, difficulty).
- `GET /api/projects/{id}`: Get project details, required skills, team members, health score.
- `POST /api/projects`: Create a new project posting.
- `PUT /api/projects/{id}`: Update project details.
- `DELETE /api/projects/{id}`: Delete or archive project.

## Team & Invitation Endpoints
- `GET /api/teams/project/{projectId}`: Get team structure and health stats for a project.
- `POST /api/teams/invite`: Send invitation to a candidate.
- `POST /api/teams/invitations/{id}/accept`: Accept team invitation.
- `POST /api/teams/invitations/{id}/reject`: Reject team invitation.
- `DELETE /api/teams/{teamId}/members/{userId}`: Remove team member or leave team.

## Recommendation Endpoints
- `GET /api/recommendations/projects/{projectId}`: Generate and return AI candidate recommendations for a project.
- `GET /api/recommendations/demo`: Special demo endpoint loading "Smart Campus Management System" preset with real-time candidate additions.
- `POST /api/recommendations/teams/{teamId}/add-member/{userId}`: Add recommended candidate to team and dynamically recalculate team health score.

## Task Endpoints
- `GET /api/tasks/projects/{projectId}`: Get all project tasks.
- `POST /api/tasks`: Create new task.
- `PUT /api/tasks/{id}`: Update task status/priority/assignee.
- `POST /api/tasks/{id}/comments`: Add comment to task.

## Analytics & Admin Endpoints
- `GET /api/analytics/system`: Overall system metrics and chart data.
- `GET /api/analytics/evaluation`: Research evaluation metrics (Precision, Recall, F1, Skill Coverage).
- `GET /api/admin/users`: Admin list and status toggling for users.
