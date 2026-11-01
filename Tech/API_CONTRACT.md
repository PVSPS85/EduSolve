# EduSolve API Contract (Draft v1)

**Status:** Proposed shared contract for the frontend, database, backend, AI-agent and integration workstreams. The SQL migration and contracts must be tested against a local Supabase project before production.

## 1. Architecture rules

- **Frontend:** React + TypeScript + Vite. Use the Supabase JavaScript client for authenticated sessions, RLS-protected reads, Realtime subscriptions, Storage uploads and the documented RPCs.
- **Database:** Supabase PostgreSQL. The migration at `supabase/migrations/202610290001_initial_schema.sql` is the source of truth for table and RPC names.
- **Backend:** Supabase Edge Functions (TypeScript / Deno) for third-party integrations, multi-step server operations, outbound email, input validation, rate limiting and webhook handling.
- **AI service:** Private Python + FastAPI service. CrewAI is used only for workflows that benefit from multiple coordinated steps. Simple chat summaries can use a single model call.
- **Email:** Resend called server-side. Never expose the Resend API key in the frontend.
- **Realtime:** Supabase Realtime for authorized new-message, notification and workspace-activity updates. Realtime updates do not replace database authorization.

Supabase automatically exposes a Postgres-backed Data API; use it for ordinary RLS-controlled reads rather than building duplicate CRUD endpoints. Use Edge Functions or narrowly scoped RPCs for privileged state transitions. See [Supabase Data API](https://supabase.com/docs/guides/api) and [RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security).

## 2. Base URLs and authentication

- Supabase API base: `https://<PROJECT_REF>.supabase.co`
- Data API: `/rest/v1/`
- Database RPC: `/rest/v1/rpc/<function_name>`
- Edge Functions: `/functions/v1/<function-name>`
- Internal AI service (private network/service URL): `/internal/v1/`

Browser calls use the Supabase publishable/anon project key in the `apikey` header and the current user's access token as `Authorization: Bearer <access_token>`. Use the current Supabase project key format configured by the project; do not hard-code keys in source control. Supabase Auth handles sign-up, sign-in, password recovery, session refresh and sign-out. Configure Resend as the production custom SMTP provider for Auth messages when ready.

**Never put `service_role`, AI service secrets, Resend secrets, GitHub OAuth secrets/webhook secrets, or video-provider API secrets in client code.**

## 3. Data-access convention

Use direct Supabase queries for RLS-controlled reads:

- Project feed: select `projects` with public statuses; join only public fields from `organizations`.
- Student profile: select `profiles`, `student_profiles`, `student_skills`, portfolio, experience and certification rows permitted by profile visibility.
- NGO profile: select public fields from `organizations`; never include `organization_private_records` in public profile queries.
- Applications: the applicant or active organization members of the relevant project can read it.
- Conversations and messages: active conversation members only.
- Workspaces and workspace contents: active workspace members only.
- Notifications: recipient only.
- Saved/dismissed projects and block list: only the owning student can read/manage their own entries.
- Rating summaries: use `student_rating_summary` and published reviews subject to RLS.

Do not build a second general CRUD API for resources already available via RLS. Do not bypass RLS from the browser.

## 3a. Student feed preferences and blocking

These are simple per-user records protected by RLS and may be accessed through the Supabase client:

- `student_saved_projects`: select/insert/delete only when `student_id = auth.uid()`.
- `project_dismissals`: select/insert/delete only when `student_id = auth.uid()`.
- `user_blocks`: a user may create/delete a row only when `blocker_id = auth.uid()` and may read their own block list. Do not notify the blocked user merely because a block was created.

The `send-message`, application, assignment and invitation workflows must check block state server-side. A block must not be treated as a reason to expose either party's private data. If the users already share an active project workspace, define a clear safety/moderation flow before removing access or allowing communication to continue.

## 4. Transactional RPCs in the initial migration

Call these using `supabase.rpc(...)`. They validate `auth.uid()` and perform the core database transition atomically:

### `create_organization`

Request:
```json
{
  "p_display_name": "Example Community Foundation",
  "p_legal_name": "Example Community Foundation Trust",
  "p_registration_type": "trust",
  "p_registration_identifier": "EXAMPLE-REG-123",
  "p_official_email": "contact@example.org",
  "p_description": "An example description",
  "p_mission": "Support community education",
  "p_focus_areas": ["Education", "Digital Literacy"],
  "p_city": "Bengaluru",
  "p_region": "Karnataka",
  "p_website_url": "https://example.org"
}
```

Response is a one-row table result: `organization_id`, `verification_status`. The function creates the organization, private registration record and initial owner membership together. New organizations start as pending and cannot publish projects.

### `submit_project_application`

Request:
```json
{
  "p_project_id": "<uuid>",
  "p_intro_message": "I am interested and have relevant React experience.",
  "p_relevant_skills": ["React", "TypeScript"],
  "p_portfolio_url": "https://github.com/example"
}
```

Response: one-row table result containing `application_id`, `conversation_id`, and `application_status`. It only accepts applications from a user with a student profile to a published project whose organization is verified and enabled to post. It creates or returns the project-linked direct conversation with the applicant and the project's posting representative.

### `assign_project_to_student`

Request:
```json
{
  "p_project_id": "<uuid>",
  "p_student_id": "<uuid>",
  "p_assignment_note": "Please review the requirements and first tasks."
}
```

Response: one-row table result containing `workspace_id`, `application_id`, and `member_role`. Only a manager/owner/representative of the project organization can call it. It accepts an eligible application, creates or reuses the single workspace for the project, adds the NGO representative and student, marks the application accepted and records an activity event. New students invited later are not members until the invitation and required NGO approval complete.

### `invite_workspace_student`

Request: `p_workspace_id`, `p_invitee_id`, `p_invitation_message`. Allowed to authorized workspace managers/student lead. Creates a pending invitation and notification. The invited student must be an existing EduSolve student. The database rejects invitations where an active workspace member has blocked the invitee.

### `respond_workspace_invitation`

Request: `p_invitation_id`, `p_accept` (boolean). Only the invitee can respond. Accepting changes the state to `accepted` but does **not** grant workspace access yet.

### `review_workspace_invitation`

Request: `p_invitation_id`, `p_approve` (boolean). Only an authorized representative of the workspace's NGO can review an accepted invitation. Approval creates the active workspace membership and adds the student to the project group conversation; rejection does not.

### `submit_progress_update`

Request: `p_workspace_id`, `p_report_date`, `p_completed_work`, optional `p_next_steps`, `p_blockers`, `p_related_task_id`, `p_github_url`. Must be an active workspace member. One update per member per workspace per date is upserted. The function records activity and notifications.

### `complete_project`

Request: `p_workspace_id`. Only an authorized representative of the owning NGO can complete the project. The workspace and project become completed, enabling the review flow.

### `submit_project_review`

Request: `p_workspace_id`, `p_student_id`, `p_overall_rating`, optional `p_quality_rating`, `p_reliability_rating`, `p_communication_rating`, `p_teamwork_rating`, `p_written_review`. Only an authorized representative of the owning NGO can review an active student member after project completion. One review per organization/student/workspace. Review content and averages must never be fabricated by AI or supplied as a client-computed average.

## 5. Edge Function contracts

Every user-facing function must authenticate the caller, validate input, authorize the action from database facts, and return a normalized error response. Use the user's JWT/RLS-scoped client for normal data access where suitable. If a service-role client is used for privileged work, manually validate the caller and resource permissions first; the service-role key bypasses RLS.

| Function | Request body | Result / rules |
|---|---|---|
| `organization-run-verification` | `{ "organization_id": "<uuid>" }` | Run checks against permitted official sources; store a verification-check result; never approve solely because an ID was entered. Rate-limit this endpoint. |
| `project-create` | Project fields from `projects` excluding IDs, status, and server-owned fields | Creates a draft for an organization the caller can manage. |
| `project-update` | `{ "project_id": "<uuid>", "changes": { ... } }` | Updates only allowed fields on an owned organization project. Validate field allowlist. |
| `project-publish` | `{ "project_id": "<uuid>" }` | Publish only if the organization has `verification_status=verified` and `project_posting_enabled=true`, and all required fields are valid. Sets `published_at`. |
| `project-close` | `{ "project_id": "<uuid>" }` | Owner/manager closes a project and prevents new applications. |
| `application-decision` | `{ "application_id": "<uuid>", "decision": "under_review" | "declined" }` | Owning organization only. Assignment/acceptance uses `assign_project_to_student` so workspace creation is transactional. |
| `send-message` | `{ "conversation_id": "<uuid>", "client_message_id": "<uuid>", "message_type": "text" | "image" | "file", "body": "...", "attachment_paths": [] }` | Active conversation member only. Validate body, attachment paths, size and MIME type; reject direct/group communications prohibited by a block policy, rate-limit and make the request idempotent using `client_message_id`. |
| `workspace-task-create` | `{ "workspace_id": "<uuid>", "title": "...", "description": "...", "assignee_id": "<uuid>", "deadline": "YYYY-MM-DD" }` | Only workspace coordinator/NGO representative or permitted student lead. The assignee must be an active member. |
| `workspace-task-update` | `{ "task_id": "<uuid>", "changes": { ... } }` | Validate field allowlist and ensure caller can edit the requested fields; an assigned member may update permitted status/completion fields only. |
| `workspace-file-finalize` | `{ "workspace_id": "<uuid>", "storage_path": "...", "original_file_name": "...", "mime_type": "...", "size_bytes": 1234, "related_task_id": null }` | Verify active membership, bucket/path, upload ownership, allowlisted MIME type and size before saving metadata. Private storage only. |
| `project-review-report` | `{ "review_id": "<uuid>", "reason": "..." }` | Creates a safety report; does not hide a review automatically. |
| `ai-chat-summary` | `{ "conversation_id": "<uuid>", "question": "optional short question" }` | Verify caller is an active conversation member. Derive whether the caller is an NGO representative or student from DB records; never trust a client-supplied role. Build a minimal authorized profile/project payload server-side and send it to the AI service. Do not send unrelated/private chats or registration documents. |
| `ai-problem-structure` | `{ "problem_statement": "..." }` | Authorized organization member only. Returns a proposed title, summary, skills, deliverables, risks and questions; NGO must review before saving/publishing. |
| `ai-project-recommendations` | `{ "limit": 10, "filters": { ... } }` | Return existing published project IDs and evidence-based match explanations from authorized profile fields; no fabricated credentials or ratings. |
| `call-session-create` | `{ "conversation_id": "<uuid>", "call_type": "audio" | "video" | "group_video" }` | Optional provider integration (Daily was a candidate, not yet locked). Check membership, create a provider room/token server-side, return short-lived join data only. |
| `github-connect-start` | `{ "workspace_id": "<uuid>" }` | Workspace manager/authorized lead only; begin OAuth. Tokens remain server-side. |
| `github-webhook` | Provider webhook payload | No user JWT; verify GitHub signature, deduplicate delivery ID, normalize allowed events and append to `github_events`/workspace activity. |
| `resend-webhook` | Resend webhook payload | No user JWT; verify provider signature, deduplicate event ID and update email delivery status. |

Email sending should be driven by specific server-side events (verification status changed, application accepted/declined, invitation, assignment, important task update). Avoid mailing every chat message by default. Keep Resend keys in Edge Function secrets and record only necessary delivery metadata.

## 6. Internal AI service contracts

The Python/FastAPI service is private and is called by a trusted Edge Function, not directly from the browser. Use a service-to-service secret or signed requests. The AI service does not need unrestricted database credentials; the caller sends the minimum authorized context.

### `POST /internal/v1/chat-summary`
Request: `{ "viewer_role": "ngo_representative" | "student", "project": { ...authorized fields... }, "other_party_profile": { ...authorized fields... }, "question": "optional" }`
Response: `{ "summary": "...", "relevant_evidence": ["..."], "missing_information": ["..."], "suggested_questions": ["..."], "disclaimer": "AI assistance may be incomplete; verify important information." }`

### `POST /internal/v1/problem-structure`
Request: `{ "problem_statement": "...", "organization_focus_areas": ["..."] }`
Response: `{ "suggested_title": "...", "short_description": "...", "objectives": ["..."], "required_skills": ["..."], "deliverables": ["..."], "constraints_to_clarify": ["..."] }`

### `POST /internal/v1/project-recommendations`
Request: `{ "student_skills": ["..."], "interests": ["..."], "projects": [{ "id": "<uuid>", "required_skills": ["..."], "description": "..." }] }`
Response: `{ "recommendations": [{ "project_id": "<uuid>", "reasons": ["..."] }] }`

AI responses must use structured output validation. Treat user text and retrieved content as untrusted data, not instructions. Do not let agents approve NGOs, assign projects, grant access, suspend accounts, or create ratings autonomously. CrewAI can orchestrate multi-step research/structuring tasks, but the source-check and approval policy remains in backend code and authorized human review.

## 7. Error envelope

Use this error shape consistently for custom Edge Functions:
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action.",
    "request_id": "<correlation-id>"
  }
}
```

Expected statuses: `200/201` success, `400` invalid input, `401` unauthenticated, `403` unauthorized, `404` missing/inaccessible resource (avoid leaking cross-user existence), `409` duplicate/conflicting state, `413` file too large, `422` invalid workflow state, `429` rate limited, `500` unexpected error. Never return stack traces, secret values, raw verification documents, or LLM provider credentials.

## 8. Required security and integration tests

- A student cannot create or publish an NGO project.
- An unverified/disabled organization cannot publish a project or accept an assignment.
- A student cannot read another student's private profile, application or unrelated conversation.
- An applicant and the relevant NGO representative can read their project-linked conversation; unrelated users cannot.
- A non-member cannot read workspace tasks, files, activity, progress or GitHub events.
- An invited student cannot read a workspace until accepted and approved.
- Only the owning NGO can assign an eligible applicant or complete the project.
- Only the owning NGO can submit a review for an active student after completion; duplicate reviews fail.
- Client-provided role/user IDs cannot override `auth.uid()`.
- AI endpoints cannot accept arbitrary private profile fields from the frontend; backend constructs context.
- Storage path, MIME type, file size and ownership checks are tested.
- GitHub and Resend webhooks reject invalid signatures and deduplicate replayed deliveries.
- Run database RLS tests with both allowed and denied cases. Supabase recommends tests for each operation and role; see [RLS testing guidance](https://supabase.com/docs/guides/database/postgres/row-level-security).

## 9. Ownership and branch boundary

- Database developer: `supabase/migrations/`, RLS tests and schema documentation.
- Backend developer: `supabase/functions/`, function tests and Resend/verification/provider integrations; align with RPC signatures in the migration.
- AI developer: `ai-service/` Python/FastAPI/CrewAI and internal AI schemas; no direct database mutation.
- Frontend developer: `src/` React components, Supabase client calls and API typings; no service-role key.
- Integration lead: merge approved work into `integration`, resolve env/config differences, run migrations and tests, then merge to `main` only after validation.

If an endpoint, field or RPC signature must change, update this contract and coordinate with every affected branch before merging.
