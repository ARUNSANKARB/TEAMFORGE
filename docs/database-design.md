# TeamForge Database Design Documentation

## Overview
The database uses a normalized relational design targeting PostgreSQL. It features standard constraints, foreign keys, unique indexes, and audit timestamps (`created_at`, `updated_at`).

## Entity Relationship Summary

```
[ users ] (1) ------ (1) [ student_profiles ]
    |                         |
    | (1)                     | (1)
    v                         v
[ roles ]               [ user_skills ] ------ (M) [ skills ]
                              |
                              | (M)
[ projects ] (1) ------- (M) [ project_skills ] ------ (M) [ skills ]
    |
    | (1)
    +------ (M) [ teams ] (1) ------ (M) [ team_members ]
    |             |
    |             +----------------- (M) [ team_invitations ]
    |
    +------ (M) [ recommendations ] ------ (M) [ recommendation_reasons ]
    |
    +------ (M) [ tasks ] (1) ------------ (M) [ task_comments ]
```

## Schema Details

- `users`: Credentials, name, college, department, year, system role.
- `student_profiles`: Bio, portfolio links, availability, experience count, work/communication preferences.
- `skills`: Pre-seeded & dynamically expandable skill taxonomy.
- `user_skills`: Junction linking student profiles to skills with proficiency levels.
- `projects`: Title, problem statement, domain, status, difficulty, team size requirements.
- `project_skills`: Required skills per project with mandatory flag.
- `teams`: Formed teams for projects with status tracking.
- `team_members`: Members joined to a team with assigned roles.
- `team_invitations`: Pending, accepted, or rejected invitation requests.
- `recommendations`: Computed compatibility scores and sub-factor breakdowns.
- `recommendation_reasons`: Itemized positive and negative matching points for explainability cards.
- `tasks`: Kanban task board items with status, priority, due date, assigned member.
- `task_comments`: Collaboration discussion items on tasks.
- `notifications`: System and team alerts.
- `activities`: Audit feed of project and team events.
