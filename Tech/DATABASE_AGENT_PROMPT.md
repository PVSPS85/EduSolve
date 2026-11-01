# Antigravity Prompt — EduSolve Database Branch

You are working on the **EduSolve database workstream only**. First inspect the existing Git repository and branch. Work only in the database-owned paths (`supabase/migrations/`, `supabase/tests/`, and relevant database docs). Do not rewrite the frontend, backend Edge Functions or AI service.

## Source of truth

Use the shared contracts:
- `docs/API_CONTRACT.md`
- `docs/DATABASE_SCHEMA.md`
- `openapi.yaml`
- `supabase/migrations/202610290001_initial_schema.sql`

The migration is a draft generated for review. Do not assume it is executable just because it exists. Do not deploy or apply it to a shared/production Supabase project.

## Tasks

1. Inspect the repository's existing Supabase configuration and current migrations. If the project already has schema objects, identify conflicts before changing anything. Do not blindly overwrite existing migrations.
2. Validate the SQL migration syntax and semantics against the actual local Supabase PostgreSQL version. Use the Supabase CLI/local stack where available. Fix syntax errors and document any schema-version assumptions.
3. Review every table's grants, RLS policies, indexes, Storage policies and security-definer functions. Keep the `private` schema out of the exposed Data API schemas. Every security-definer function must use a fixed `search_path` and fully qualified object references.
4. Verify that public/anonymous reads expose only verified organization profiles and allowed project listings. Confirm registration identifiers and supporting documents are not exposed through public organization queries.
5. Verify that the public RPCs validate `auth.uid()` and enforce the expected state/role checks. Do not trust client-supplied role or user IDs.
6. Check and fix the assignment flow so a single project has at most one workspace, and the assignment transaction accepts the eligible application, adds the initial NGO representative/student memberships, and records activity atomically.
7. Check the team invitation flow: invited student acceptance is separate from NGO approval; no workspace access until approval creates an active project membership.
8. Add executable pgTAP tests with both allow and deny assertions for profile visibility, org private records, project publishing/assignment, applications, conversations/messages, workspace data, invitation access, progress, ratings, notification ownership and Storage.
9. Run `supabase test db` and the relevant local migration commands. Add the exact commands and actual outcomes to the database README. If a test cannot be run, state that clearly—do not claim it passed.
10. Generate updated database TypeScript types if the repository uses Supabase generated types. Update `docs/DATABASE_SCHEMA.md` and `docs/API_CONTRACT.md` if any contract changes.
11. Commit the database-only changes to `feature/database` and prepare a concise handoff: changed files, migration order, tests run, known blockers and any API contract change that frontend/backend/AI must know about.

## Acceptance criteria

- Database migrations apply cleanly to a clean local Supabase database.
- RLS tests demonstrate both authorized and unauthorized cases.
- `create_organization`, `submit_project_application`, `assign_project_to_student`, invitation RPCs, `submit_progress_update`, `complete_project` and `submit_project_review` work as specified.
- No secret is committed and no role can be granted by editing user metadata.
- No changes are made to other workstreams' modules.
