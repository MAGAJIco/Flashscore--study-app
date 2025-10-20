# Feature Roadmap (priority: least → most important)
Date: 2025-10-07
Contact: teamdarlingangel@gmail.com

This document lists proposed new features for Sports Central, ordered from least to most important (so reviewers can start with lower-risk items and work toward high-impact, compliance-critical work). Each feature includes a short description, acceptance criteria, suggested owner, and a rough effort estimate.

---

## Low Priority (Cosmetic / Nice-to-have)
1. Multi-theme / Dark Mode refinements
   - Description: Add additional themes, subtle motion-reduced variants, and a theme switcher with persistence.
   - Acceptance criteria: Theme persists across sessions; accessible contrast checks pass.
   - Owner: frontend
   - Est.: 1–2 days

2. Social share snippets + Deep linking
   - Description: Generate shareable images/meta tags for match predictions and leaderboards; deep links open the app to specific content.
   - Acceptance criteria: OG meta tags present for shared pages; deep links handled by frontend router.
   - Owner: frontend
   - Est.: 2–3 days

3. Extra sports coverage (non-core leagues)
   - Description: Add coverage for additional leagues (lower priority sports) via the sports API.
   - Acceptance criteria: Data flows correctly and UI displays scores for selected leagues.
   - Owner: backend / api
   - Est.: 2–4 days per league

4. Localization bootstrap for 2–3 extra languages
   - Description: Add i18n framework and initial translations for 1–2 secondary locales.
   - Acceptance criteria: Language switcher works; translation coverage >= 60% for core screens.
   - Owner: frontend / docs
   - Est.: 3–5 days

---

## Medium Priority (Product / Safety Enhancements)
5. Analytics & Ad Vendor “Kids Mode” toggle
   - Description: Centralized feature flag that disables targeted analytics/ad SDK calls for users in Kids Mode.
   - Acceptance criteria: No profiling identifiers sent for Kids Mode users; third-party SDKs operate in restricted mode or not loaded.
   - Owner: frontend / infra
   - Est.: 2–4 days

6. Server-side gating for monetization APIs
   - Description: Backend checks preventing Kids Mode accounts from accessing payment or withdrawal endpoints, plus safe error messages in UI.
   - Acceptance criteria: Any attempt to call payment endpoints as a Kids Mode user returns 403 and logs an audit record.
   - Owner: backend / payments
   - Est.: 2–3 days

7. Basic Parental Consent UI & Email flow
   - Description: In-app flow to request parental consent, including sending a secure verification link to the parent email.
   - Acceptance criteria: Consent link issues one-time token, consent recorded with timestamp, UI shows consent status.
   - Owner: frontend / backend
   - Est.: 3–5 days

8. Automated tests: Unit + E2E for Kids Mode flows
   - Description: Add unit tests for gating logic and E2E tests covering sign-up as under-13, Kids Mode gating, parental consent, and consent revocation.
   - Acceptance criteria: CI runs tests; E2E tests pass in CI for core flows.
   - Owner: qa / frontend
   - Est.: 4–7 days

9. COPPA documentation & in-app privacy notice
   - Description: Merge COPPA docs into public Privacy Policy / Terms and add an in-app short notice shown during signup for under-13.
   - Acceptance criteria: Updated public docs with contact email (teamdarlingangel@gmail.com) and effective date; in-app notice displayed at signup.
   - Owner: legal / frontend
   - Est.: 1–2 days

---

## High Priority (Compliance, Safety, Core Product)
10. Verifiable Parental Consent (robust)
    - Description: A secure, auditable parental consent system (options: emailed verification link, credit-card-mini-charge validation, or government ID where required). Consent records include parent identity, verification method, timestamp, and audit trail.
    - Acceptance criteria: Consent cannot be spoofed; revocation works and stops further processing; consent records exportable in machine-readable format.
    - Owner: backend / security / legal
    - Est.: 1–3 weeks (depending on verification methods)

11. Data Subject Rights APIs (export / delete / rectify)
    - Description: Endpoints and admin/parent UI to export a child’s data, request deletion, or correct profile info; server-side workflow to purge data and revoke access.
    - Acceptance criteria: Export produces a ZIP/JSON of all personal data; deletion workflow permanently removes PII and logs the action with owner confirmation.
    - Owner: backend / infra
    - Est.: 1–2 weeks

12. Server-side content filtering for gambling/odds and public chat
    - Description: Fully remove gambling/odds UI/flows and disable chat functionality for Kids Mode users at the API level (not only client-side).
    - Acceptance criteria: No endpoints return odds or betting flows for Kids Mode; chat messages blocked and stored as “blocked” in logs for audit.
    - Owner: backend / frontend
    - Est.: 3–7 days

13. Compliance audit & legal sign-off
    - Description: Retain counsel for COPPA-specific review and affirmation; perform risk assessment for third-party vendors.
    - Acceptance criteria: Legal memo or sign-off and a simple remediation plan for any flagged issues.
    - Owner: legal / product
    - Est.: variable (external counsel)

14. Monitoring & Incident Response (Sentry / Logs / Alerts)
    - Description: Add monitoring for any Kids Mode violations (e.g., if a prohibited endpoint is hit), add alerting channel, and a playbook for data incidents.
    - Acceptance criteria: Alerts fire on defined policy violations; playbook accessible to the team.
    - Owner: infra / ops
    - Est.: 3–5 days

---

## Implementation notes & sequencing
- Start with low-cost, low-risk items (cosmetics, docs) while core compliance work (parential consent, server-side gating, data rights) is being designed.
- Parallelize: frontend E2E scaffolding can be started while backend APIs are implemented.
- Because GitHub Issues are disabled for this repository, use a PR checklist or the feature branch to track work items; I can open a PR with a detailed checklist if you want.
- Use feature flags for staged rollouts (especially for parental consent flows and gated payments).

---

## Suggested immediate next steps (I can take these actions if you confirm)
1. Add this ROADMAP.md to branch `feature/roadmap` and open a pull request with the full checklist.  
2. Add unit + E2E test scaffolding (Jest + Playwright) focused on Kids Mode gating.  
3. Implement the simple parental consent email flow (token + timestamp) and add tests.

If you want me to push the roadmap file to the repository and open the PR from branch `feature/roadmap`, confirm and I will proceed.