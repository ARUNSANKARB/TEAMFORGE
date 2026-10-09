# TeamForge Recommendation Algorithm & Mathematical Specification

## 1. Overview
TeamForge utilizes a constraint-first, multi-factor recommendation pipeline designed specifically for academic software project team formation. Unlike generic similarity matchers, TeamForge emphasizes **skill complementarity** alongside **skill similarity** and hard constraint validation.

## 2. Multi-Factor Scoring Formula

The overall compatibility utility score \( U(i, r) \) between student \( i \) and role \( r \) of project \( p \) is defined as:

$$
U(i, r) = 0.30 \times S(i, r) + 0.20 \times C(i, r) + 0.15 \times R(i, r) + 0.10 \times I(i, p) + 0.10 \times E(i, p) + 0.05 \times A(i, p) + 0.05 \times P(i, r) + 0.05 \times B(i, T)
$$

Where:
- \( S(i, r) \): Weighted Required Skill Match Score
- \( C(i, r) \): Skill Complementarity / Diversity Gain Score
- \( R(i, r) \): Role Compatibility Score
- \( I(i, p) \): Project Domain & Interest Match
- \( E(i, p) \): Experience Alignment Score (with neutral cold-start prior)
- \( A(i, p) \): Availability Overlap Ratio
- \( P(i, r) \): Preferred Work / Communication Style Match
- \( B(i, T) \): Team Balance & Leadership Distribution Score

All component scores are normalized to the range \([0, 100]\).

## 3. Constraint-First Filtering (Eligibility)

Before ranking, an eligibility filter \( E(i, r) \in \{0, 1\} \) eliminates non-viable candidates:

$$
E(i, r) = 
\begin{cases} 
1 & \text{if } M_r \subseteq K_i \land A(i, p) \ge \theta \land n_i < n_{\max} \\
0 & \text{otherwise}
\end{cases}
$$

Where:
- \( M_r \): Mandatory skill set for role \( r \)
- \( K_i \): Skills possessed by candidate \( i \)
- \( A(i, p) \): Available hours vs project commitment ratio
- \( n_i \): Active projects currently joined by candidate \( i \)
- \( n_{\max} \): Maximum allowed concurrent projects (default = 3)

## 4. Cold-Start Protection & Fairness Factor

To prevent new students without project history from being penalized unfairly, candidates with zero completed projects receive a neutral prior score of 0.50 (50%) for the reliability/experience component rather than zero. 

An exposure fairness multiplier \( F(i) \) balances shortlist visibility:

$$
F(i) = 1 - \frac{e_i}{\max_j e_j}
$$

Where \( e_i \) tracks recent shortlist appearances of student \( i \).

## 5. Team Health Metric

For any formed or candidate team \( T \), TeamForge calculates a aggregate Team Health Score:

$$
\text{Team Health} = 0.35 \times \text{SkillCoverage} + 0.25 \times \text{RoleCoverage} + 0.20 \times \text{ExperienceBalance} + 0.20 \times \text{AvailabilityScore}
$$

- **Skill Coverage**: Percentage of project's total required skills covered by at least one member with level \(\ge \text{INTERMEDIATE}\).
- **Role Coverage**: Percentage of project roles filled.
- **Experience Balance**: Variance-weighted measure of senior-junior mentorship blend.
- **Availability Score**: Minimum overlapping free hours across all current team members.
