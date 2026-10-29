# EduSolve — Master Project Blueprint

**Purpose:** Shared source of truth for the EduSolve team. Read this before building any module.  
**Status:** Product requirements and proposed architecture. This is not a claim that backend features are implemented.  
**Design identity:** Emerald Sand Dusk.

---

## 1. Product overview

EduSolve connects verified NGOs and eligible community organizations with student volunteers who collaborate on real educational, digital-literacy, and community-impact projects. It is a volunteering and collaboration platform, not a freelancing marketplace.

### Core user journeys

1. A student registers, verifies their email, completes a profile, discovers projects, and applies with a short introduction and relevant skills.
2. An NGO registers its organization and representative, submits the applicable registration details, and goes through a verification process.
3. Only an organization approved for publishing may publish a project.
4. The student and NGO communicate in the project conversation. Both can access role-appropriate AI help based only on information they are authorized to see.
5. The NGO assigns an eligible student to the project from the conversation's three-dot menu. This action creates a workspace automatically.
6. The assigned student and NGO access the workspace directly from the main **Workspace / My Workspaces** navigation.
7. The assigned student can invite other EduSolve students. New members must accept and, where configured, receive NGO approval before they gain workspace access.
8. The team manages tasks, daily progress, files, project updates, and later GitHub activity in the workspace.
9. After project completion and eligibility checks, the NGO can review the student's contribution. The rating appears in the student's profile and next to their name in chat.

### Product principles

- The student and NGO use the same underlying project feed. Only authorized NGOs get the **Post a Problem** action.
- A student application is short: an introduction and relevant skills. Details are discussed in chat.
- A project has a private workspace accessible only to approved members.
- The workspace task UI is a simple list showing task, assignee, deadline, status, and actions; not a Kanban board.
- Privacy and authorization are backend/database requirements, not just UI visibility.
- The AI can summarize information and suggest questions; it does not make final NGO verification, student selection, account suspension, or project assignment decisions.
- No false claims about government endorsement, verified identities, project impact, or AI accuracy.

## 2. Agreed design identity

Use the existing Figma design and keep it consistent. Do not regenerate the whole UI when fixing a single issue.

| Token | Value | Use |
|---|---|---|
| Deep Ocean Navy | `#14334A` | Primary brand, navigation, main buttons |
| Muted Teal | `#70A1A8` | Secondary actions, highlights |
| Warm Sand | `#EDD7AE` | Soft surfaces, tags |
| Natural Taupe | `#C8B294` | Supporting surfaces |
| Earthy Brown | `#A57E59` | Supporting accent |
| Antique Gold | `#836527` | Small premium accents |
| Main background | `#FAF9F6` | Main page background |
| Card background | `#FFFFFF` | Content cards |
| Primary text | `#183047` | Main text |
| Secondary text | `#64748B` | Secondary text |
| Border | `#E5E7EB` | Borders/dividers |

The Figma screens are visual references/prototypes. Verify that actual exported code matches the screens and that interactions are genuinely connected before calling a feature complete.

---

## 3. Technology stack

### Frontend
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query (if useful for remote data/caching)
- React Hook Form + Zod
- Supabase JavaScript client

### Main backend platform
- Supabase Auth
- PostgreSQL
- Row Level Security (RLS)
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions (TypeScript/Deno) for server-side and third-party operations

### AI service
- Python + FastAPI
- CrewAI only for workflows that really need multi-step agents
- One selected LLM provider (OpenAI **or** Gemini; do not build the same feature for both initially)
- Pydantic models for request/response validation

### Supporting services
- Resend for transactional email
- Playwright for end-to-end browser tests; external-registry interaction only where permitted
- GitHub for source control and issues
- GitHub Actions for CI
- Sentry/PostHog/Langfuse can be introduced later when useful
- Daily or another reviewed provider is only a candidate for live audio/video calls; confirm current pricing/terms before selecting and implementing it

### Key architecture rule

Supabase is the primary application backend. Do not build a second general-purpose Node/Express backend that duplicates Supabase. Use Edge Functions for protected business workflows and the separate Python/FastAPI service for AI/agent workflows. Simple data operations may be performed through the Supabase client when RLS grants the user the correct access.

---

## 4. Team responsibilities and boundaries

There are four technical workstreams. Integration is a cross-cutting responsibility and should be owned by the integration lead. If there are four people total, one person must have a combined role; recommended allocation below assumes the integration lead is also the AI owner. If there are five people (four implementers plus the integration lead), make AI a separate owner.

### Member A — Frontend

**Owns:** React UI, routes, reusable components, client-side form validation, responsive layouts, loading/error/empty states, and integration with typed data/service functions.

**Deliverables:**
- Working routes and pages matching Figma.
- `src/components`, `src/pages`/`src/routes`, `src/features`, `src/lib/supabase.ts` (or current equivalent).
- No secrets in browser code.
- No assumptions that hiding a button is authorization.
- Component/unit tests for key UI.

**Must coordinate with:** Backend on request/response shapes; database owner on table fields; integration lead on routes/environment variables.

### Member B — Database

**Owns:** PostgreSQL schema, SQL migrations, keys/relationships, constraints, indexes, RLS policies, seed data, and database/RLS testing.

**Deliverables:**
- Versioned SQL migrations under `supabase/migrations/`.
- Updated ER diagram and `docs/database-schema.md`.
- A seed script containing clearly fictional development data only.
- RLS policies and tests for allowed and denied access.
- No secrets committed to Git.

**Must coordinate with:** Backend owner before table/column changes. Do not make unannounced schema edits; write a migration and update the schema contract.

### Member C — Backend / application workflows

**Owns:** Supabase Edge Functions (TypeScript/Deno), authorization checks, transactional workflows, Resend integration, verification workflow orchestration, and trusted webhook handlers where needed.

**Core operations:**
- Submit and progress NGO verification.
- Publish project only for an authorized verified organization.
- Submit application.
- Assign project and create workspace atomically.
- Invite and approve workspace members.
- Submit review after completion.
- Send appropriate notification/email.

**Deliverables:**
- Functions under `supabase/functions/`.
- Request/response definitions in `docs/api-contracts.md`.
- Unit/integration tests and safe error handling.
- Privileged secrets server-side only.

### Member D — AI agents + integration lead (for a four-person team)

If there is a fifth person, assign AI agents to that person and keep integration lead as a separate role.

**AI owns:** Python/FastAPI service, CrewAI flows for multi-step work, model API calls, typed input/output, tool permissioning, prompt evaluation, timeout/retry handling and logs with privacy safeguards.

**AI deliverables:**
- `ai-service/app/main.py` (or equivalent), agents/flows, Pydantic schemas, tests, `.env.example`.
- AI endpoints documented in `docs/api-contracts.md`.
- AI receives only minimal context already authorized by the backend; it must not have broad access to private user data.

**Integration lead additionally owns:**
- Agreeing contracts before parallel coding.
- Repo structure, branch/PR discipline, environment templates, integration tests, deployment checklist, end-to-end validation and final merge.
- Maintaining this blueprint and resolving cross-module conflicts.

### Cross-cutting tasks (not a separate feature team)

- Testing: every contributor writes tests for their own module; integration lead runs cross-module and end-to-end tests.
- Security: database owner enforces RLS; backend owner enforces business permissions; AI owner applies least-privilege context; frontend owner handles safe UX.
- DevOps: integration lead owns GitHub Actions, environment setup, migrations order and deployment coordination.
- Documentation: each person documents their module; integration lead keeps shared architecture/API docs consistent.

---

## 5. Proposed repository structure

```text
edusolve/
├── frontend/                    # React + TypeScript + Vite (existing generated/exported UI)
├── supabase/
│   ├── config.toml
│   ├── migrations/              # Versioned schema, constraints, policies, indexes
│   ├── seed.sql                 # Fictional local development data only
│   └── functions/
│       ├── submit-ngo-registration/
│       ├── check-ngo-verification/
│       ├── publish-project/
│       ├── submit-application/
│       ├── assign-project/
│       ├── invite-workspace-member/
│       ├── review-workspace-invitation/
│       ├── submit-progress-update/
│       ├── complete-project/
│       ├── submit-project-review/
│       └── send-notification-email/
├── ai-service/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── schemas/
│   │   ├── agents/
│   │   ├── flows/
│   │   ├── tools/
│   │   └── tests/
│   ├── requirements.txt or pyproject.toml
│   ├── Dockerfile
│   └── .env.example
├── docs/
│   ├── MASTER_BLUEPRINT.md
│   ├── database-schema.md
│   ├── api-contracts.md
│   ├── architecture.md
│   └── run-local.md
├── e2e/                         # Playwright tests
├── .github/workflows/           # CI checks
├── .env.example                 # Never include real credentials
├── .gitignore
└── README.md
```

If the existing Figma export uses a different root layout, preserve it where sensible and document the mapping; do not duplicate the frontend by creating a second React app accidentally.

---

## 6. Proposed database model

**Important:** This is the proposed schema to review before implementation. The database has not yet been finalized or created just because the Figma UI exists.

### Core tables

1. `profiles`
   - `id` UUID, primary key referencing `auth.users.id`
   - `display_name`, `avatar_path`, `bio`
   - `account_type` (`student` or `ngo_representative`)
   - optional education fields and public profile preferences
   - `created_at`, `updated_at`

2. `organizations`
   - `id`, `name`, `mission`, `website`, `location`
   - `registration_type`, `registration_identifier`
   - `verification_status` (`pending`, `checking`, `manual_review`, `verified`, `additional_info_required`, `rejected`)
   - `submitted_by`, timestamps

3. `organization_members`
   - `organization_id`, `user_id`, `membership_role`, `membership_status`
   - supports authorized representatives/owners; do not assume any registered user owns any NGO

4. `organization_verification_checks`
   - `organization_id`, source, check status, fields compared, evidence/source URL if permitted, checked timestamp, reviewer/notes as appropriate
   - store only evidence needed for verification; protect sensitive uploaded documents

5. `student_skills`
   - `id`, `student_id`, skill name/normalized key, proficiency only if self-reported and clearly labelled

6. `student_portfolio_items`
   - `id`, `student_id`, title, description, URL, technologies, visibility, created timestamp

7. `projects`
   - `id`, `organization_id`, `created_by`, title, summary, problem statement, category
   - `required_skills`, duration, estimated weekly commitment, work mode, expected team size
   - deliverables, constraints, image storage path
   - status (`draft`, `pending`, `published`, `paused`, `assigned`, `in_progress`, `completed`, `closed`)
   - timestamps

8. `applications`
   - `id`, `project_id`, `student_id`, intro message, selected/relevant skills snapshot
   - status (`submitted`, `under_discussion`, `accepted`, `declined`, `withdrawn`)
   - timestamps
   - unique constraint preventing duplicate active applications for a student/project

9. `conversations`
   - `id`, optional `project_id`, optional `application_id`, conversation type, created timestamp

10. `conversation_members`
    - `conversation_id`, `user_id`, membership status, `last_read_at`

11. `messages`
    - `id`, `conversation_id`, `sender_id`, message body, timestamps, edited/deleted indicators as appropriate

12. `message_attachments`
    - `id`, `message_id`, storage path, original filename, content type, size, uploader, timestamp

13. `project_workspaces`
    - `id`, `project_id`, `lead_student_id`, `created_by`, status, created timestamp
    - MVP assumption: one workspace/team per project; the assigned student is the initial lead and can invite more students subject to approval. If the requirement becomes multiple independent teams per project, revisit this model before migration.

14. `project_members`
    - `id`, `workspace_id`, `user_id`, member role, status (`invited`, `pending_ngo_approval`, `active`, `declined`, `removed`), invited/approved/joined timestamps
    - unique constraint for `(workspace_id, user_id)`

15. `workspace_invitations`
    - `id`, `workspace_id`, `invited_user_id`, `invited_by`, status, message, timestamps, `reviewed_by`

16. `workspace_tasks`
    - `id`, `workspace_id`, title, description, `assigned_to`, due date, status (`todo`, `in_progress`, `completed`, `blocked`), `created_by`, timestamps

17. `progress_updates`
    - `id`, `workspace_id`, `author_id`, update date, completed work, next steps, blockers, related task, optional link, timestamp

18. `workspace_files`
    - `id`, `workspace_id`, `uploaded_by`, storage path, filename, content type, size, related task/deliverable, timestamp

19. `workspace_activity`
    - `id`, `workspace_id`, `actor_id`, event type, related entity ID, safe metadata JSON, timestamp
    - append an event when assignment, membership approval, task update, progress submission or file upload occurs

20. `project_reviews`
    - `id`, `project_id`, reviewer user ID (authorized NGO representative), reviewed student ID, overall rating 1–5, quality, reliability, communication, teamwork, optional review text, status, timestamps
    - one eligible review per reviewer/student/project combination
    - only allowed after project completion and verified eligibility

21. `notifications`
    - `id`, `user_id`, type, title, body, related resource, `read_at`, created timestamp

22. `safety_reports`
    - `id`, `reporter_id`, reported user, optional message reference, reason, description, status, created timestamp
    - restricted access; no public report content

### Later tables / optional integrations

- `github_connections` and `github_events` when authorized GitHub integration is built.
- `ai_run_logs` with careful privacy minimization (do not store full private message content by default).
- Student-to-NGO reviews only if the team confirms this feature; initial agreed rating is NGO-to-student.

### Relationships (high level)

- One auth user has one `profiles` row.
- An organization may have multiple authorized members.
- One organization owns many projects.
- One project has many applications and one MVP workspace.
- A workspace has many approved project members, tasks, progress updates, files and activity events.
- Conversations have members and messages; file attachments are tied to messages.
- Eligible completed projects can produce project reviews.

### Database/security rules

- Add foreign keys, appropriate uniqueness constraints, indexes on common filtering/join columns, and timestamps.
- Enable RLS on exposed tables and write policies for each operation. Do not confuse granting table privileges with row policies; both need review.
- Student profiles expose only shared fields. Personal contact details and verification documents are private by default.
- Only conversation members can read conversation messages/attachments.
- Only active project members can access workspace tasks, progress, activity and files.
- Only authorized organization members can manage that organization's projects.
- Only approved organizations can publish projects.
- Only the authorized NGO owner/coordinator can assign students and approve membership.
- Do not expose service-role keys in frontend or AI prompts.

---

## 7. Backend workflows and contracts

Use Supabase directly for simple reads/updates where RLS makes the operation safe. Use Edge Functions for composite, privileged or third-party operations.

### Core function contracts (names are proposed)

- `submit-ngo-registration`: validate and store organization submission.
- `check-ngo-verification`: initiate checks against permitted sources; record evidence/result; inconclusive results require human review.
- `publish-project`: validate organization posting permission and required project fields.
- `submit-application`: create application and ensure associated conversation exists or is linked.
- `assign-project`: verify caller is authorized for the organization/project; accept the correct application; create the workspace and initial project membership; add an activity event; create notifications. These database changes must be atomic.
- `invite-workspace-member`: create an invitation for an existing student.
- `review-workspace-invitation`: record student acceptance/decline and NGO approval/rejection; activate membership only after required approvals.
- `submit-progress-update`: add report and activity event; notify relevant members.
- `complete-project`: move project through the defined completion state after authorized review.
- `submit-project-review`: check project eligibility, reviewer authority and duplicate review constraints before storing the rating.
- `generate-ai-summary`: request an AI result using only authorized, minimal context.
- `send-notification-email`: send an appropriate event email through Resend and record delivery state/error safely.

**Atomic assignment:** The assignment must not partially create the workspace. Use a transactional PostgreSQL function/RPC with explicit authorization checks, called by the protected Edge Function, or another demonstrated transactional implementation. Do not make several uncoordinated client requests and assume they form one transaction.

### Main flow

1. NGO registration → verification status pending.
2. Verification process checks permitted sources; exceptions need human review.
3. Approved NGO publishes project.
4. Student submits application; application and conversation are linked to project.
5. Student and NGO chat.
6. Authorized NGO selects **Assign Project & Create Workspace**.
7. Backend performs the assignment transaction and adds NGO + lead student as active workspace members.
8. Both get a notification and can open the workspace from **My Workspaces** navigation without entering chat.
9. Student invites collaborators; invitee accepts, then NGO approval occurs if required.
10. Only then are new members granted workspace access.
11. Team adds tasks, daily progress, files and activity events.
12. After eligible completion, NGO submits the student's review. Rating and review count appear on the student's profile and in the chat header.

---

## 8. AI/agentic AI scope

Keep AI workflows separate from normal application authorization. CrewAI is for multi-step tasks, not for every simple AI call.

### Initial AI features

1. **Chat profile/project summary:** a controlled model call that explains the other party's authorized profile against project requirements. This may not need CrewAI.
2. **Problem structuring:** assist an NGO in turning a draft into clearer requirements, deliverables and scope; NGO reviews/approves the output.
3. **Student–project relevance:** suggest matches based on documented skills and project requirements; explain evidence and missing information, but never make a final selection.
4. **NGO verification research assistance:** summarize evidence from permitted official sources. It must not decide verification based solely on an LLM response or a registration number.

### AI service rules

- Python + FastAPI + CrewAI where orchestration is useful.
- Use one LLM provider for MVP.
- Validate request and response with Pydantic.
- The trusted backend constructs authorized context and calls the AI service.
- Do not give the AI service broad database/service-role credentials by default.
- Never send unrelated conversations, private contact information or confidential files.
- Keep a clear distinction between source facts, AI inferences and missing information.
- Include timeouts, retries, rate limits, safe logging and an error state.
- AI must never autonomously approve NGOs, assign a project, accept/reject a student, or suspend an account.

---

## 9. Notifications, email, calling and external integrations

### Resend
Use for transactional email: email verification/auth support where configured, NGO verification updates, application/assignment updates, workspace invitations, and important project events. Trigger emails from a trusted server-side function. API keys stay server-side. Set up a verified sender domain before production use.

### In-app notifications
Store notifications in PostgreSQL. Use Supabase Realtime for live updates. Check the recipient's permissions before creating or delivering a notification.

### Photo and document sharing
Use private Supabase Storage buckets, validated file type and size, and policies that check active conversation/workspace membership. Use short-lived signed access links when appropriate.

### Calls and screen sharing
The Figma screens are not actual calls. Daily is a candidate, not a finalized provider. Confirm price, usage limits, privacy/terms and SDK fit before connecting. Never put server secrets in frontend code.

### GitHub activity
Start with a manually entered repository link and update links. Later, create a secure GitHub connection/webhook integration and append verified commit/pull-request/release events to `workspace_activity`. Do not claim automatic GitHub activity until the integration works.

### NGO registry checks
Prefer official APIs or authorized data sources. Playwright may automate permitted public browser interactions but must not bypass CAPTCHA or other controls. Inconclusive/mismatched records go to manual review. A matching number is not government endorsement.

---

## 10. Environment and secret handling

- Commit `.env.example`, never real `.env` files or keys.
- Frontend may use only the Supabase project URL and publishable/anon key; RLS must still protect all data.
- Resend, LLM provider and privileged Supabase secrets must be server-side only.
- Do not paste production keys into ChatGPT, commit them, or share them through screenshots.
- AI service should authenticate requests from the backend and receive minimal scoped data.
- Separate local, test and production credentials/projects where practical.

Example environment variable names only (values blank):

```env
# frontend/.env.example
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Supabase Edge Function secrets are configured in Supabase, not Vite.
RESEND_API_KEY=
AI_SERVICE_URL=
AI_SERVICE_SHARED_SECRET=

# ai-service/.env.example
LLM_API_KEY=
AI_SERVICE_SHARED_SECRET=
```

Use the current recommended Supabase publishable key naming for new projects if provided by the project setup; never expose a secret/service-role key in `VITE_` variables.

---

## 11. Testing and release requirements

### Frontend owner
- Component tests for forms, role-based navigation, rating display, task states and loading/error states.

### Database owner
- Migration works from a clean database.
- RLS tests for both allowed and forbidden reads/writes.
- Test cross-user and cross-workspace access denial.

### Backend owner
- Test invalid role, wrong organization, invalid application status, double assignment, duplicate invitations, duplicate reviews and error/retry conditions.
- Ensure assignment creates all required records atomically.

### AI owner
- Test valid/invalid payloads, unauthorized requests, missing profile fields, prompt-injection resistance in user content, timeouts, rate limits and fabricated-output controls.

### Integration lead
- Run full Playwright paths: register → submit/verify NGO → publish project → student apply → chat → assign → workspace opens directly → invite → approval → task/progress/file → complete → review appears in chat/profile.
- Check email delivery state, navigation, mobile responsiveness and error recovery.
- Run security checks before the demo.

---

## 12. Team workflow

1. Create one GitHub repository as the source of truth.
2. Agree on `main` branch protection and feature branches, for example `feat/student-feed`, `feat/db-schema`, `feat/assign-project`, `feat/ai-summary`.
3. Create `docs/database-schema.md` and `docs/api-contracts.md` before parallel implementation begins.
4. Database owner publishes migrations and table/policy contract first.
5. Backend owner publishes endpoint/function contracts and expected errors.
6. Frontend owner connects through these contracts; no separate ad-hoc schema assumptions.
7. AI owner publishes FastAPI endpoint schemas and example request/response JSON.
8. Each contribution goes through a pull request; do not edit the same file in parallel without coordination.
9. Integration lead maintains an `.env.example`, runs migrations, checks environment setup and merges tested work.
10. Commit working increments frequently; never leave integration until the very end.

### Definition of done for a feature

- UI exists and works for loading, success, empty and error states.
- Backend validation and authorization are implemented.
- RLS and relevant permissions are tested.
- Data changes persist in the database.
- Secrets are not exposed.
- Relevant tests pass.
- Documentation/contracts are updated.
- Feature works in the integrated environment, not just on one developer's machine.

---

## 13. MVP implementation order

1. Repository and environment setup; agree on schema and API contracts.
2. Database migrations, core RLS and Supabase Auth integration.
3. Profiles and NGO registration/verification status flow.
4. NGO projects and student feed/application flow.
5. Conversation membership and real-time messages.
6. Atomic assignment and workspace creation, including direct My Workspaces access.
7. Invitations and membership approval.
8. Tasks, progress updates, private file sharing and activity timeline.
9. Resend notifications.
10. AI chat summary, then appropriate multi-step CrewAI workflows.
11. Project completion and student rating in profile and chat header.
12. Calling provider and GitHub activity when provider and integration details are confirmed.
13. End-to-end tests, security review and deployment.

Do not attempt all advanced integrations simultaneously. Get the core project lifecycle working end-to-end first.

---

## 14. Shared context for all ChatGPT teammates

All teammates should use this document as the authoritative project brief. In each role-specific ChatGPT conversation, paste this blueprint or share the file and then request work only for that person's assigned module. Ask the assistant to follow the agreed stack, table names, permissions and API contracts; not to invent a new architecture. If a requirement conflicts with this blueprint, flag the conflict and propose a decision rather than silently changing the design.

**Important status note:** The architecture and schema in this file are proposals for the team to confirm. Do not tell anyone the database, APIs, agents or integrations are already implemented until they are in GitHub and tested.
