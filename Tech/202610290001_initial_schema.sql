-- EduSolve initial schema (draft v1)
-- Supabase PostgreSQL. Review and test against a local Supabase project before deployment.
-- Sensitive state transitions must use authenticated Edge Functions or the narrowly scoped RPCs below.

create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create type public.profile_visibility as enum ('members', 'applications_only', 'private');
create type public.work_mode as enum ('remote', 'onsite', 'hybrid');
create type public.availability_status as enum ('available', 'limited', 'unavailable');
create type public.organization_registration_type as enum ('ngo_darpan', 'section_8_company', 'trust', 'society', 'other');
create type public.organization_verification_status as enum ('not_submitted', 'pending_review', 'checking_records', 'additional_information_required', 'under_manual_review', 'verified', 'rejected');
create type public.verification_check_result as enum ('match', 'mismatch', 'inconclusive', 'source_unavailable', 'manual_review_required');
create type public.organization_member_role as enum ('owner', 'manager', 'representative', 'member');
create type public.organization_member_status as enum ('invited', 'active', 'suspended', 'removed');
create type public.project_status as enum ('draft', 'pending_review', 'published', 'in_progress', 'closed', 'completed', 'archived');
create type public.application_status as enum ('submitted', 'under_review', 'accepted', 'declined', 'withdrawn');
create type public.conversation_type as enum ('direct', 'project_group');
create type public.conversation_member_status as enum ('active', 'removed');
create type public.message_type as enum ('text', 'image', 'file', 'system');
create type public.workspace_status as enum ('active', 'completed', 'archived');
create type public.workspace_member_role as enum ('ngo_representative', 'student_lead', 'student_collaborator');
create type public.workspace_member_status as enum ('active', 'removed');
create type public.workspace_invitation_status as enum ('pending', 'accepted', 'declined', 'approved', 'rejected', 'cancelled');
create type public.task_status as enum ('todo', 'in_progress', 'completed', 'blocked');
create type public.project_review_status as enum ('published', 'hidden', 'disputed');
create type public.safety_report_category as enum ('suspicious_request', 'personal_information', 'harassment', 'misleading_project', 'impersonation', 'inappropriate_content', 'other');
create type public.safety_report_status as enum ('open', 'under_review', 'resolved', 'dismissed', 'escalated');
create type public.call_type as enum ('audio', 'video', 'group_video');
create type public.call_status as enum ('created', 'active', 'ended', 'failed');

-- Core identity. Do not store role/authorization flags in user-editable metadata.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'EduSolve Member' check (char_length(display_name) between 1 and 100),
  avatar_path text,
  bio text check (bio is null or char_length(bio) <= 1200),
  visibility public.profile_visibility not null default 'members',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_user_id uuid not null references public.profiles(id) on delete cascade,
  reason text check (reason is null or char_length(reason) <= 500),
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_user_id),
  check (blocker_id <> blocked_user_id)
);

create table public.student_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  institution_name text check (institution_name is null or char_length(institution_name) <= 200),
  degree text check (degree is null or char_length(degree) <= 120),
  study_year smallint check (study_year is null or study_year between 1 and 12),
  preferred_work_mode public.work_mode,
  availability public.availability_status not null default 'limited',
  availability_hours_per_week smallint check (availability_hours_per_week is null or availability_hours_per_week between 0 and 80),
  city text,
  country text default 'India',
  portfolio_url text,
  github_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_skills (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  skill_name text not null check (char_length(skill_name) between 1 and 80),
  proficiency text check (proficiency is null or proficiency in ('beginner','intermediate','advanced','expert')),
  created_at timestamptz not null default now(),
  unique (student_id, skill_name)
);

create table public.student_portfolio_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  description text check (description is null or char_length(description) <= 2000),
  url text not null,
  technologies text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_experiences (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  organization_or_project text not null,
  role_title text not null,
  description text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create table public.student_certifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  title text not null,
  issuer text,
  issue_date date,
  credential_url text,
  created_at timestamptz not null default now()
);

-- Public organization profile is separated from sensitive registration evidence.
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 2 and 200),
  slug text unique,
  description text check (description is null or char_length(description) <= 4000),
  mission text check (mission is null or char_length(mission) <= 2000),
  focus_areas text[] not null default '{}',
  city text,
  region text,
  country text not null default 'India',
  website_url text,
  public_contact_email text,
  logo_path text,
  cover_image_path text,
  verification_status public.organization_verification_status not null default 'not_submitted',
  project_posting_enabled boolean not null default false,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_private_records (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  legal_name text not null check (char_length(legal_name) between 2 and 250),
  registration_type public.organization_registration_type not null,
  registration_identifier text not null check (char_length(registration_identifier) between 2 and 200),
  official_email text not null check (char_length(official_email) <= 254 and position('@' in official_email) > 1),
  registered_state text,
  supporting_document_paths text[] not null default '{}',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (registration_type, registration_identifier)
);

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.organization_member_role not null default 'representative',
  status public.organization_member_status not null default 'active',
  invited_by uuid references public.profiles(id) on delete set null,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- Populate this table only through trusted operational/admin procedures; never public signup.
create table public.platform_admins (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  granted_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.organization_verification_checks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_name text not null,
  source_url text,
  submitted_name text,
  retrieved_name text,
  submitted_identifier text,
  retrieved_identifier text,
  result public.verification_check_result not null,
  evidence jsonb not null default '{}'::jsonb,
  private_notes text,
  checked_by uuid references public.profiles(id) on delete set null,
  checked_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 5 and 180),
  category text not null check (char_length(category) between 2 and 80),
  short_description text not null check (char_length(short_description) between 20 and 500),
  problem_statement text not null check (char_length(problem_statement) between 20 and 10000),
  why_it_matters text,
  objectives text[] not null default '{}',
  required_skills text[] not null default '{}',
  expected_deliverables text[] not null default '{}',
  duration_weeks smallint check (duration_weeks is null or duration_weeks between 1 and 104),
  work_mode public.work_mode,
  weekly_commitment_hours numeric(4,1) check (weekly_commitment_hours is null or weekly_commitment_hours between 0 and 80),
  team_size_min smallint check (team_size_min is null or team_size_min between 1 and 100),
  team_size_max smallint check (team_size_max is null or team_size_max between 1 and 100),
  constraints text,
  material_expenses text,
  cover_image_path text,
  status public.project_status not null default 'draft',
  published_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (team_size_min is null or team_size_max is null or team_size_max >= team_size_min)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  intro_message text not null check (char_length(intro_message) between 10 and 2000),
  relevant_skills text[] not null default '{}',
  portfolio_url text,
  status public.application_status not null default 'submitted',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, student_id)
);

create table public.student_saved_projects (
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, project_id)
);

create table public.project_dismissals (
  student_id uuid not null references public.student_profiles(user_id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, project_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  type public.conversation_type not null,
  project_id uuid references public.projects(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  student_id uuid references public.student_profiles(user_id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (type = 'direct' and project_id is not null and organization_id is not null and student_id is not null)
    or (type = 'project_group' and project_id is not null and organization_id is not null and student_id is null)
  )
);
create unique index conversations_direct_unique_idx
  on public.conversations(project_id, organization_id, student_id)
  where type = 'direct';
create unique index conversations_project_group_unique_idx
  on public.conversations(project_id, organization_id)
  where type = 'project_group';

create table public.conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.conversation_member_status not null default 'active',
  joined_at timestamptz not null default now(),
  last_read_at timestamptz,
  unique (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete restrict,
  message_type public.message_type not null default 'text',
  body text check (body is null or char_length(body) <= 10000),
  reply_to_id uuid references public.messages(id) on delete set null,
  client_message_id uuid,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz,
  check (body is not null or message_type in ('image','file','system'))
);
create unique index messages_idempotency_idx on public.messages(sender_id, client_message_id) where client_message_id is not null;
create index messages_conversation_created_idx on public.messages(conversation_id, created_at desc);

create table public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  storage_path text not null unique,
  original_file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 20971520),
  created_at timestamptz not null default now()
);

create table public.project_workspaces (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,
  status public.workspace_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.project_workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.workspace_member_role not null,
  status public.workspace_member_status not null default 'active',
  added_by uuid references public.profiles(id) on delete set null,
  joined_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table public.workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.project_workspaces(id) on delete cascade,
  invited_by uuid not null references public.profiles(id) on delete restrict,
  invitee_id uuid not null references public.student_profiles(user_id) on delete cascade,
  invitation_message text check (invitation_message is null or char_length(invitation_message) <= 1000),
  status public.workspace_invitation_status not null default 'pending',
  responded_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, invitee_id, created_at)
);
create unique index workspace_invites_one_open_idx
  on public.workspace_invitations(workspace_id, invitee_id)
  where status in ('pending','accepted');

create table public.workspace_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.project_workspaces(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 180),
  description text,
  assignee_id uuid references public.profiles(id) on delete set null,
  deadline date,
  status public.task_status not null default 'todo',
  completion_note text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.progress_updates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.project_workspaces(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  report_date date not null default current_date,
  completed_work text not null check (char_length(completed_work) between 3 and 5000),
  next_steps text,
  blockers text,
  related_task_id uuid references public.workspace_tasks(id) on delete set null,
  github_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, author_id, report_date)
);

create table public.workspace_files (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.project_workspaces(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  related_task_id uuid references public.workspace_tasks(id) on delete set null,
  storage_path text not null unique,
  original_file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  created_at timestamptz not null default now()
);

create table public.workspace_activity (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.project_workspaces(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null check (char_length(event_type) between 2 and 80),
  summary text not null check (char_length(summary) between 1 and 500),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Never store GitHub access tokens in these tables. Keep OAuth credentials in a server-side secret store.
create table public.github_repositories (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references public.project_workspaces(id) on delete cascade,
  repository_node_id text not null unique,
  repository_full_name text not null,
  repository_url text not null,
  connected_by uuid not null references public.profiles(id) on delete restrict,
  connection_status text not null default 'connected' check (connection_status in ('connected','disconnected','error')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.github_events (
  id uuid primary key default gen_random_uuid(),
  repository_id uuid not null references public.github_repositories(id) on delete cascade,
  provider_delivery_id text not null unique,
  event_type text not null,
  actor_login text,
  event_title text not null,
  event_url text,
  occurred_at timestamptz,
  received_at timestamptz not null default now()
);

-- MVP rating direction: NGO reviews a student after an eligible project is completed.
create table public.project_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete restrict,
  workspace_id uuid not null references public.project_workspaces(id) on delete restrict,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  reviewer_organization_id uuid not null references public.organizations(id) on delete restrict,
  reviewee_student_id uuid not null references public.student_profiles(user_id) on delete restrict,
  overall_rating smallint not null check (overall_rating between 1 and 5),
  quality_rating smallint check (quality_rating is null or quality_rating between 1 and 5),
  reliability_rating smallint check (reliability_rating is null or reliability_rating between 1 and 5),
  communication_rating smallint check (communication_rating is null or communication_rating between 1 and 5),
  teamwork_rating smallint check (teamwork_rating is null or teamwork_rating between 1 and 5),
  written_review text check (written_review is null or char_length(written_review) <= 3000),
  status public.project_review_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, reviewer_organization_id, reviewee_student_id),
  check (reviewer_id <> reviewee_student_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  notification_type text not null,
  title text not null check (char_length(title) between 1 and 160),
  body text check (body is null or char_length(body) <= 1000),
  action_url text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.safety_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete restrict,
  target_user_id uuid references public.profiles(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  review_id uuid references public.project_reviews(id) on delete set null,
  category public.safety_report_category not null,
  description text not null check (char_length(description) between 5 and 3000),
  status public.safety_report_status not null default 'open',
  assigned_to uuid references public.profiles(id) on delete set null,
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (target_user_id is not null or conversation_id is not null or message_id is not null or project_id is not null or review_id is not null)
);

create table public.call_sessions (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  workspace_id uuid references public.project_workspaces(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  call_type public.call_type not null,
  provider text not null default 'provider_pending',
  provider_room_id text,
  status public.call_status not null default 'created',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  check (conversation_id is not null or workspace_id is not null),
  check (ended_at is null or started_at is null or ended_at >= started_at)
);

-- Metadata-only telemetry. Do not store raw private messages or prompts here by default.
create table public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  feature text not null,
  model_provider text,
  model_name text,
  status text not null check (status in ('success','failed','blocked')),
  latency_ms integer check (latency_ms is null or latency_ms >= 0),
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  created_at timestamptz not null default now()
);

create table public.email_delivery_logs (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.profiles(id) on delete set null,
  template_key text not null,
  provider_message_id text unique,
  status text not null default 'queued' check (status in ('queued','sent','delivered','bounced','failed')),
  related_notification_id uuid references public.notifications(id) on delete set null,
  last_error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated-at helper.
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Create a safe profile row when Supabase Auth creates a user. No role is read from user metadata.
create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
begin
  v_name := coalesce(nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), 100), ''), nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'EduSolve Member');
  insert into public.profiles (id, display_name)
  values (new.id, v_name)
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function private.handle_new_auth_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_edusolve on auth.users;
create trigger on_auth_user_created_edusolve
after insert on auth.users
for each row execute function private.handle_new_auth_user();

-- Authorization helpers use a fixed empty search_path and fully qualified object names.
create or replace function private.is_platform_admin(p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.platform_admins a where a.user_id = p_user_id);
$$;

create or replace function private.is_org_member(p_organization_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = p_organization_id and m.user_id = p_user_id and m.status = 'active'
  );
$$;

create or replace function private.can_manage_org(p_organization_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = p_organization_id and m.user_id = p_user_id
      and m.status = 'active' and m.role in ('owner','manager','representative')
  ) or private.is_platform_admin(p_user_id);
$$;

-- Avoid a projects <-> applications RLS recursion by evaluating organization membership in a definer helper.
create or replace function private.is_project_org_member(p_project_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.projects p
    join public.organization_members m on m.organization_id = p.organization_id
    where p.id = p_project_id and m.user_id = p_user_id and m.status = 'active'
      and m.role in ('owner','manager','representative')
  );
$$;

create or replace function private.can_view_student_profile(p_student_id uuid, p_viewer_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select p_student_id = p_viewer_id
    or private.is_platform_admin(p_viewer_id)
    or exists (select 1 from public.profiles p where p.id = p_student_id and p.visibility = 'members')
    or exists (
      select 1 from public.profiles p
      join public.applications a on a.student_id = p.id
      join public.projects pr on pr.id = a.project_id
      join public.organization_members om on om.organization_id = pr.organization_id
      where p.id = p_student_id and p.visibility = 'applications_only'
        and om.user_id = p_viewer_id and om.status = 'active'
        and om.role in ('owner','manager','representative')
        and a.status in ('submitted','under_review','accepted')
    );
$$;

create or replace function private.is_blocked_pair(p_user_a uuid, p_user_b uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_blocks b
    where (b.blocker_id = p_user_a and b.blocked_user_id = p_user_b)
       or (b.blocker_id = p_user_b and b.blocked_user_id = p_user_a)
  );
$$;

create or replace function private.is_workspace_member(p_workspace_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.project_members m
    where m.workspace_id = p_workspace_id and m.user_id = p_user_id and m.status = 'active'
  );
$$;

create or replace function private.can_manage_workspace(p_workspace_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.project_members m
    where m.workspace_id = p_workspace_id and m.user_id = p_user_id and m.status = 'active'
      and m.role in ('ngo_representative','student_lead')
  ) or private.is_platform_admin(p_user_id);
$$;

create or replace function private.is_workspace_ngo_manager(p_workspace_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.project_workspaces w
    join public.organization_members om on om.organization_id = w.organization_id
    join public.project_members pm on pm.workspace_id = w.id and pm.user_id = om.user_id
    where w.id = p_workspace_id and om.user_id = p_user_id and om.status = 'active'
      and om.role in ('owner','manager','representative') and pm.role = 'ngo_representative' and pm.status = 'active'
  ) or private.is_platform_admin(p_user_id);
$$;

create or replace function private.is_conversation_member(p_conversation_id uuid, p_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.conversation_members m
    where m.conversation_id = p_conversation_id and m.user_id = p_user_id and m.status = 'active'
  );
$$;

create or replace function private.safe_uuid_from_path(p_name text, p_position integer default 1)
returns uuid
language plpgsql immutable set search_path = '' as $$
declare
  v_segment text;
begin
  if p_position < 1 then return null; end if;
  v_segment := (string_to_array(p_name, '/'))[p_position];
  if v_segment is null or v_segment !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then return null; end if;
  return v_segment::uuid;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;
revoke all on function private.is_platform_admin(uuid) from public, anon, authenticated;
revoke all on function private.is_org_member(uuid, uuid) from public, anon, authenticated;
revoke all on function private.can_manage_org(uuid, uuid) from public, anon, authenticated;
revoke all on function private.is_project_org_member(uuid, uuid) from public, anon, authenticated;
revoke all on function private.can_view_student_profile(uuid, uuid) from public, anon, authenticated;
revoke all on function private.is_blocked_pair(uuid, uuid) from public, anon, authenticated;
revoke all on function private.is_workspace_member(uuid, uuid) from public, anon, authenticated;
revoke all on function private.can_manage_workspace(uuid, uuid) from public, anon, authenticated;
revoke all on function private.is_workspace_ngo_manager(uuid, uuid) from public, anon, authenticated;
revoke all on function private.is_conversation_member(uuid, uuid) from public, anon, authenticated;
revoke all on function private.safe_uuid_from_path(text, integer) from public, anon, authenticated;
grant execute on function private.is_platform_admin(uuid) to authenticated;
grant execute on function private.is_org_member(uuid, uuid) to authenticated;
grant execute on function private.can_manage_org(uuid, uuid) to authenticated;
grant execute on function private.is_project_org_member(uuid, uuid) to authenticated;
grant execute on function private.can_view_student_profile(uuid, uuid) to authenticated;
grant execute on function private.is_workspace_member(uuid, uuid) to authenticated;
grant execute on function private.can_manage_workspace(uuid, uuid) to authenticated;
grant execute on function private.is_workspace_ngo_manager(uuid, uuid) to authenticated;
grant execute on function private.is_conversation_member(uuid, uuid) to authenticated;
grant execute on function private.safe_uuid_from_path(text, integer) to authenticated;

-- Triggers for updated_at.
do $$
declare r record;
begin
  for r in select table_schema, table_name from information_schema.columns
    where table_schema = 'public' and column_name = 'updated_at'
      and table_name = any (array[
        'profiles','student_profiles','student_portfolio_items','student_experiences',
        'organizations','organization_private_records','projects','applications','conversations',
        'project_workspaces','workspace_invitations','workspace_tasks','progress_updates',
        'github_repositories','project_reviews','safety_reports','email_delivery_logs'
      ])
  loop
    execute format('drop trigger if exists set_updated_at on %I.%I', r.table_schema, r.table_name);
    execute format('create trigger set_updated_at before update on %I.%I for each row execute function private.set_updated_at()', r.table_schema, r.table_name);
  end loop;
end;
$$;

-- Indexes for common queries and RLS membership checks.
create index user_blocks_blocked_user_idx on public.user_blocks(blocked_user_id);
create index student_saved_projects_student_created_idx on public.student_saved_projects(student_id, created_at desc);
create index project_dismissals_student_created_idx on public.project_dismissals(student_id, created_at desc);
create index student_skills_student_idx on public.student_skills(student_id);
create index student_portfolio_student_idx on public.student_portfolio_items(student_id, sort_order);
create index student_experiences_student_idx on public.student_experiences(student_id);
create index student_certifications_student_idx on public.student_certifications(student_id);
create index org_members_user_status_idx on public.organization_members(user_id, status);
create index org_members_org_status_idx on public.organization_members(organization_id, status);
create index verification_checks_org_time_idx on public.organization_verification_checks(organization_id, checked_at desc);
create index projects_org_status_created_idx on public.projects(organization_id, status, created_at desc);
create index projects_status_created_idx on public.projects(status, created_at desc);
create index applications_student_created_idx on public.applications(student_id, created_at desc);
create index applications_project_status_idx on public.applications(project_id, status, created_at desc);
create index conv_members_user_status_idx on public.conversation_members(user_id, status);
create index project_members_user_status_idx on public.project_members(user_id, status);
create index project_members_workspace_status_idx on public.project_members(workspace_id, status);
create index tasks_workspace_status_deadline_idx on public.workspace_tasks(workspace_id, status, deadline);
create index progress_workspace_date_idx on public.progress_updates(workspace_id, report_date desc);
create index activity_workspace_time_idx on public.workspace_activity(workspace_id, created_at desc);
create index github_events_repo_time_idx on public.github_events(repository_id, occurred_at desc);
create index reviews_student_status_created_idx on public.project_reviews(reviewee_student_id, status, created_at desc);
create index notifications_recipient_unread_idx on public.notifications(recipient_id, read_at, created_at desc);
create index safety_reports_status_created_idx on public.safety_reports(status, created_at desc);

-- RLS is enabled only on EduSolve tables. Workflow writes use validated Edge Functions or the scoped RPCs below.
alter table public.profiles enable row level security;
alter table public.user_blocks enable row level security;
alter table public.student_profiles enable row level security;
alter table public.student_skills enable row level security;
alter table public.student_portfolio_items enable row level security;
alter table public.student_experiences enable row level security;
alter table public.student_certifications enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_private_records enable row level security;
alter table public.organization_members enable row level security;
alter table public.platform_admins enable row level security;
alter table public.organization_verification_checks enable row level security;
alter table public.projects enable row level security;
alter table public.applications enable row level security;
alter table public.student_saved_projects enable row level security;
alter table public.project_dismissals enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.message_attachments enable row level security;
alter table public.project_workspaces enable row level security;
alter table public.project_members enable row level security;
alter table public.workspace_invitations enable row level security;
alter table public.workspace_tasks enable row level security;
alter table public.progress_updates enable row level security;
alter table public.workspace_files enable row level security;
alter table public.workspace_activity enable row level security;
alter table public.github_repositories enable row level security;
alter table public.github_events enable row level security;
alter table public.project_reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.safety_reports enable row level security;
alter table public.call_sessions enable row level security;
alter table public.ai_usage_events enable row level security;
alter table public.email_delivery_logs enable row level security;

-- Revoke default API privileges only on EduSolve-owned tables.
revoke all on table public.profiles,
  public.user_blocks,
  public.student_profiles,
  public.student_skills,
  public.student_portfolio_items,
  public.student_experiences,
  public.student_certifications,
  public.organizations,
  public.organization_private_records,
  public.organization_members,
  public.platform_admins,
  public.organization_verification_checks,
  public.projects,
  public.applications,
  public.student_saved_projects,
  public.project_dismissals,
  public.conversations,
  public.conversation_members,
  public.messages,
  public.message_attachments,
  public.project_workspaces,
  public.project_members,
  public.workspace_invitations,
  public.workspace_tasks,
  public.progress_updates,
  public.workspace_files,
  public.workspace_activity,
  public.github_repositories,
  public.github_events,
  public.project_reviews,
  public.notifications,
  public.safety_reports,
  public.call_sessions,
  public.ai_usage_events,
  public.email_delivery_logs from anon, authenticated;
grant select on public.organizations, public.projects to anon;
grant select on public.profiles, public.student_profiles, public.student_skills, public.student_portfolio_items,
  public.student_experiences, public.student_certifications, public.organizations, public.organization_members,
  public.platform_admins, public.organization_private_records, public.organization_verification_checks,
  public.projects, public.applications, public.student_saved_projects, public.project_dismissals, public.user_blocks, public.conversations, public.conversation_members, public.messages,
  public.message_attachments, public.project_workspaces, public.project_members, public.workspace_invitations,
  public.workspace_tasks, public.progress_updates, public.workspace_files, public.workspace_activity,
  public.github_repositories, public.github_events, public.project_reviews, public.notifications,
  public.safety_reports, public.call_sessions to authenticated;

grant insert, update, delete on public.student_profiles, public.student_skills, public.student_portfolio_items,
  public.student_experiences, public.student_certifications to authenticated;
grant update (display_name, avatar_path, bio, visibility) on public.profiles to authenticated;
grant update (read_at) on public.notifications to authenticated;
grant insert, delete on public.user_blocks to authenticated;
grant select, insert, delete on public.student_saved_projects, public.project_dismissals to authenticated;

-- Safe profile read/update policies.
create policy profiles_read_visible on public.profiles for select to authenticated
  using (private.can_view_student_profile(id) or private.is_platform_admin());
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy user_blocks_read_own on public.user_blocks for select to authenticated
  using (blocker_id = (select auth.uid()));
create policy user_blocks_insert_own on public.user_blocks for insert to authenticated
  with check (blocker_id = (select auth.uid()) and blocked_user_id <> (select auth.uid())
    and exists (select 1 from public.profiles p where p.id = blocked_user_id and private.can_view_student_profile(p.id)));
create policy user_blocks_delete_own on public.user_blocks for delete to authenticated
  using (blocker_id = (select auth.uid()));

create policy student_profiles_read_visible on public.student_profiles for select to authenticated
  using (private.can_view_student_profile(user_id) or private.is_platform_admin());
create policy student_profiles_insert_self on public.student_profiles for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy student_profiles_update_self on public.student_profiles for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy student_profiles_delete_self on public.student_profiles for delete to authenticated
  using (user_id = (select auth.uid()));

create policy student_skills_read_visible on public.student_skills for select to authenticated
  using (private.can_view_student_profile(student_id) or private.is_platform_admin());
create policy student_skills_insert_self on public.student_skills for insert to authenticated
  with check (student_id = (select auth.uid()));
create policy student_skills_update_self on public.student_skills for update to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));
create policy student_skills_delete_self on public.student_skills for delete to authenticated
  using (student_id = (select auth.uid()));

create policy student_portfolio_read_visible on public.student_portfolio_items for select to authenticated
  using (private.can_view_student_profile(student_id) or private.is_platform_admin());
create policy student_portfolio_insert_self on public.student_portfolio_items for insert to authenticated
  with check (student_id = (select auth.uid()));
create policy student_portfolio_update_self on public.student_portfolio_items for update to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));
create policy student_portfolio_delete_self on public.student_portfolio_items for delete to authenticated
  using (student_id = (select auth.uid()));

create policy student_experiences_read_visible on public.student_experiences for select to authenticated
  using (private.can_view_student_profile(student_id) or private.is_platform_admin());
create policy student_experiences_insert_self on public.student_experiences for insert to authenticated
  with check (student_id = (select auth.uid()));
create policy student_experiences_update_self on public.student_experiences for update to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));
create policy student_experiences_delete_self on public.student_experiences for delete to authenticated
  using (student_id = (select auth.uid()));

create policy student_certifications_read_visible on public.student_certifications for select to authenticated
  using (private.can_view_student_profile(student_id) or private.is_platform_admin());
create policy student_certifications_insert_self on public.student_certifications for insert to authenticated
  with check (student_id = (select auth.uid()));
create policy student_certifications_update_self on public.student_certifications for update to authenticated
  using (student_id = (select auth.uid())) with check (student_id = (select auth.uid()));
create policy student_certifications_delete_self on public.student_certifications for delete to authenticated
  using (student_id = (select auth.uid()));

-- Organization profile. Registration identifiers/documents live in a separate private table.
create policy organizations_public_verified_anon on public.organizations for select to anon
  using (verification_status = 'verified');
create policy organizations_public_or_member on public.organizations for select to authenticated
  using (verification_status = 'verified' or private.is_org_member(id) or private.is_platform_admin());
create policy org_private_read_manager on public.organization_private_records for select to authenticated
  using (private.can_manage_org(organization_id) or private.is_platform_admin());
create policy org_members_read on public.organization_members for select to authenticated
  using (user_id = (select auth.uid()) or private.is_org_member(organization_id) or private.is_platform_admin());
create policy platform_admin_read_self on public.platform_admins for select to authenticated
  using (user_id = (select auth.uid()));
create policy verification_checks_read_admin on public.organization_verification_checks for select to authenticated
  using (private.is_platform_admin());

-- Public project discovery; sensitive mutations are mediated by Edge Functions.
create policy projects_public_read_anon on public.projects for select to anon
  using (status in ('published','in_progress','closed','completed') and exists (
    select 1 from public.organizations o where o.id = organization_id
      and o.verification_status = 'verified' and o.project_posting_enabled = true
  ));
create policy projects_public_or_related_read on public.projects for select to authenticated
  using ((status in ('published','in_progress','closed','completed') and exists (
      select 1 from public.organizations o where o.id = organization_id
        and o.verification_status = 'verified' and o.project_posting_enabled = true
    ))
    or private.is_org_member(organization_id)
    or exists (select 1 from public.applications a where a.project_id = projects.id and a.student_id = (select auth.uid()))
    or private.is_platform_admin());

create policy applications_read_related on public.applications for select to authenticated
  using (student_id = (select auth.uid()) or private.is_project_org_member(project_id) or private.is_platform_admin());

create policy student_saved_projects_own on public.student_saved_projects for select to authenticated
  using (student_id = (select auth.uid()));
create policy student_saved_projects_insert_own on public.student_saved_projects for insert to authenticated
  with check (student_id = (select auth.uid()) and exists (
    select 1 from public.projects p where p.id = project_id and p.status in ('published','in_progress','closed','completed')
  ));
create policy student_saved_projects_delete_own on public.student_saved_projects for delete to authenticated
  using (student_id = (select auth.uid()));
create policy project_dismissals_own on public.project_dismissals for select to authenticated
  using (student_id = (select auth.uid()));
create policy project_dismissals_insert_own on public.project_dismissals for insert to authenticated
  with check (student_id = (select auth.uid()) and exists (
    select 1 from public.projects p where p.id = project_id and p.status in ('published','in_progress','closed','completed')
  ));
create policy project_dismissals_delete_own on public.project_dismissals for delete to authenticated
  using (student_id = (select auth.uid()));

create policy conversations_read_members on public.conversations for select to authenticated
  using (private.is_conversation_member(id) or private.is_platform_admin());
create policy conversation_members_read_members on public.conversation_members for select to authenticated
  using (user_id = (select auth.uid()) or private.is_conversation_member(conversation_id) or private.is_platform_admin());
create policy messages_read_members on public.messages for select to authenticated
  using (private.is_conversation_member(conversation_id) or private.is_platform_admin());
create policy message_attachments_read_members on public.message_attachments for select to authenticated
  using (exists (select 1 from public.messages m where m.id = message_id and private.is_conversation_member(m.conversation_id))
    or private.is_platform_admin());

create policy workspaces_read_members on public.project_workspaces for select to authenticated
  using (private.is_workspace_member(id) or private.is_platform_admin());
create policy project_members_read_members on public.project_members for select to authenticated
  using (user_id = (select auth.uid()) or private.is_workspace_member(workspace_id) or private.is_platform_admin());
create policy workspace_invitations_read_related on public.workspace_invitations for select to authenticated
  using (invitee_id = (select auth.uid()) or invited_by = (select auth.uid())
    or private.is_workspace_member(workspace_id) or private.is_platform_admin());
create policy workspace_tasks_read_members on public.workspace_tasks for select to authenticated
  using (private.is_workspace_member(workspace_id) or private.is_platform_admin());
create policy progress_updates_read_members on public.progress_updates for select to authenticated
  using (private.is_workspace_member(workspace_id) or private.is_platform_admin());
create policy workspace_files_read_members on public.workspace_files for select to authenticated
  using (private.is_workspace_member(workspace_id) or private.is_platform_admin());
create policy workspace_activity_read_members on public.workspace_activity for select to authenticated
  using (private.is_workspace_member(workspace_id) or private.is_platform_admin());
create policy github_repositories_read_members on public.github_repositories for select to authenticated
  using (private.is_workspace_member(workspace_id) or private.is_platform_admin());
create policy github_events_read_members on public.github_events for select to authenticated
  using (exists (select 1 from public.github_repositories r where r.id = repository_id and private.is_workspace_member(r.workspace_id))
    or private.is_platform_admin());

create policy project_reviews_read_published on public.project_reviews for select to authenticated
  using (
    reviewer_id = (select auth.uid())
    or private.is_platform_admin()
    or (status = 'published' and (
      reviewee_student_id = (select auth.uid())
      or private.can_view_student_profile(reviewee_student_id)
    ))
  );
create policy notifications_read_own on public.notifications for select to authenticated
  using (recipient_id = (select auth.uid()));
create policy notifications_mark_read_own on public.notifications for update to authenticated
  using (recipient_id = (select auth.uid())) with check (recipient_id = (select auth.uid()));
create policy safety_reports_read_reporter_or_admin on public.safety_reports for select to authenticated
  using (reporter_id = (select auth.uid()) or private.is_platform_admin());
create policy call_sessions_read_related on public.call_sessions for select to authenticated
  using ((conversation_id is not null and private.is_conversation_member(conversation_id))
    or (workspace_id is not null and private.is_workspace_member(workspace_id))
    or private.is_platform_admin());

-- Narrowly scoped transactional RPC: applying creates/returns the project-linked direct conversation.
create or replace function public.submit_project_application(
  p_project_id uuid,
  p_intro_message text,
  p_relevant_skills text[] default '{}',
  p_portfolio_url text default null
)
returns table (application_id uuid, conversation_id uuid, application_status public.application_status)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_project public.projects%rowtype;
  v_application_id uuid;
  v_conversation_id uuid;
  v_existing_status public.application_status;
begin
  if v_user is null then raise exception using errcode = '28000', message = 'Authentication required'; end if;
  if char_length(coalesce(p_intro_message, '')) < 10 or char_length(p_intro_message) > 2000 then
    raise exception using errcode = '22023', message = 'Introduction must be between 10 and 2000 characters';
  end if;
  if not exists (select 1 from public.student_profiles s where s.user_id = v_user) then
    raise exception using errcode = '42501', message = 'A student profile is required to apply';
  end if;
  select p.* into v_project
  from public.projects p
  join public.organizations o on o.id = p.organization_id
  where p.id = p_project_id and p.status = 'published'
    and o.verification_status = 'verified' and o.project_posting_enabled = true;
  if not found then raise exception using errcode = 'P0002', message = 'Project is unavailable for applications'; end if;
  if v_project.created_by = v_user then raise exception using errcode = '42501', message = 'Project owners cannot apply to their own project'; end if;
  if private.is_blocked_pair(v_user, v_project.created_by) then
    raise exception using errcode = '42501', message = 'This conversation cannot be started due to a block setting';
  end if;

  select a.id, a.status into v_application_id, v_existing_status
  from public.applications a where a.project_id = p_project_id and a.student_id = v_user for update;
  if found then
    if v_existing_status = 'withdrawn' then
      update public.applications a set intro_message = p_intro_message,
        relevant_skills = coalesce(p_relevant_skills, '{}'), portfolio_url = p_portfolio_url,
        status = 'submitted', reviewed_by = null, reviewed_at = null, accepted_at = null
      where a.id = v_application_id;
    else
      raise exception using errcode = '23505', message = 'An application already exists for this project';
    end if;
  else
    insert into public.applications(project_id, student_id, intro_message, relevant_skills, portfolio_url)
    values (p_project_id, v_user, p_intro_message, coalesce(p_relevant_skills, '{}'), p_portfolio_url)
    returning id into v_application_id;
  end if;

  insert into public.conversations(type, project_id, organization_id, student_id, created_by)
  values ('direct', v_project.id, v_project.organization_id, v_user, v_user)
  on conflict (project_id, organization_id, student_id) where type = 'direct'
  do update set updated_at = now()
  returning id into v_conversation_id;

  insert into public.conversation_members(conversation_id, user_id)
  values (v_conversation_id, v_user), (v_conversation_id, v_project.created_by)
  on conflict (conversation_id, user_id) do update set status = 'active';

  return query select v_application_id, v_conversation_id,
    (select a.status from public.applications a where a.id = v_application_id);
end;
$$;
revoke all on function public.submit_project_application(uuid, text, text[], text) from public, anon;
grant execute on function public.submit_project_application(uuid, text, text[], text) to authenticated;

-- Narrowly scoped transactional RPC: assign a project, create/reuse one workspace and activate memberships.
create or replace function public.assign_project_to_student(
  p_project_id uuid,
  p_student_id uuid,
  p_assignment_note text default null
)
returns table (workspace_id uuid, application_id uuid, member_role public.workspace_member_role)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_project public.projects%rowtype;
  v_application_id uuid;
  v_application_status public.application_status;
  v_workspace_id uuid;
  v_group_conversation_id uuid;
  v_member_role public.workspace_member_role;
  v_student_already_active boolean := false;
begin
  if v_actor is null then raise exception using errcode = '28000', message = 'Authentication required'; end if;
  select p.* into v_project from public.projects p where p.id = p_project_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Project not found'; end if;
  if not private.can_manage_org(v_project.organization_id, v_actor) then
    raise exception using errcode = '42501', message = 'Only an authorized organization representative can assign this project';
  end if;
  if not exists (select 1 from public.organizations o where o.id = v_project.organization_id
    and o.verification_status = 'verified' and o.project_posting_enabled = true) then
    raise exception using errcode = '42501', message = 'Organization is not approved to assign projects';
  end if;
  if not exists (select 1 from public.student_profiles s where s.user_id = p_student_id) then
    raise exception using errcode = '22023', message = 'Target user is not an eligible student';
  end if;
  if private.is_blocked_pair(v_actor, p_student_id) or private.is_blocked_pair(v_project.created_by, p_student_id) then
    raise exception using errcode = '42501', message = 'Project assignment is not allowed because a participant has blocked the other';
  end if;
  select a.id, a.status into v_application_id, v_application_status
  from public.applications a where a.project_id = p_project_id and a.student_id = p_student_id for update;
  if not found or v_application_status not in ('submitted','under_review','accepted') then
    raise exception using errcode = '22023', message = 'Student must have an eligible application for this project';
  end if;
  if v_project.status not in ('published','in_progress') then
    raise exception using errcode = '22023', message = 'Project is not open for assignment';
  end if;

  insert into public.project_workspaces(project_id, organization_id, created_by, status)
  values (p_project_id, v_project.organization_id, v_actor, 'active')
  on conflict (project_id) do update set updated_at = now()
  returning id into v_workspace_id;

  insert into public.project_members(workspace_id, user_id, role, status, added_by)
  values (v_workspace_id, v_actor, 'ngo_representative', 'active', v_actor)
  on conflict (workspace_id, user_id) do update set status = 'active';

  insert into public.conversations(type, project_id, organization_id, student_id, created_by)
  values ('project_group', p_project_id, v_project.organization_id, null, v_actor)
  on conflict (project_id, organization_id) where type = 'project_group'
  do update set updated_at = now()
  returning id into v_group_conversation_id;
  insert into public.conversation_members(conversation_id, user_id, status)
  values (v_group_conversation_id, v_actor, 'active')
  on conflict (conversation_id, user_id) do update set status = 'active';

  select exists (select 1 from public.project_members pm where pm.workspace_id = v_workspace_id
    and pm.user_id = p_student_id and pm.status = 'active') into v_student_already_active;

  if exists (select 1 from public.project_members pm where pm.workspace_id = v_workspace_id
    and pm.role = 'student_lead' and pm.status = 'active' and pm.user_id <> p_student_id) then
    v_member_role := 'student_collaborator';
  else
    v_member_role := 'student_lead';
  end if;
  insert into public.project_members(workspace_id, user_id, role, status, added_by)
  values (v_workspace_id, p_student_id, v_member_role, 'active', v_actor)
  on conflict (workspace_id, user_id) do update set status = 'active', role = excluded.role;

  insert into public.conversation_members(conversation_id, user_id, status)
  values (v_group_conversation_id, p_student_id, 'active')
  on conflict (conversation_id, user_id) do update set status = 'active';

  -- The NGO representative who performs the assignment must also be able to continue the direct conversation.
  insert into public.conversation_members(conversation_id, user_id, status)
  select c.id, v_actor, 'active'
  from public.conversations c
  where c.type = 'direct' and c.project_id = p_project_id
    and c.organization_id = v_project.organization_id and c.student_id = p_student_id
  on conflict (conversation_id, user_id) do update set status = 'active';

  update public.applications a set status = 'accepted', reviewed_by = v_actor,
    reviewed_at = coalesce(a.reviewed_at, now()), accepted_at = coalesce(a.accepted_at, now())
  where a.id = v_application_id;
  update public.projects p set status = 'in_progress' where p.id = p_project_id and p.status = 'published';

  if not v_student_already_active then
    insert into public.workspace_activity(workspace_id, actor_id, event_type, summary, details)
    values (v_workspace_id, v_actor, 'project_assigned', 'Project assigned and workspace access granted',
      jsonb_build_object('project_id', p_project_id, 'student_id', p_student_id, 'application_id', v_application_id,
        'assignment_note', left(coalesce(p_assignment_note, ''), 1000)));
    insert into public.notifications(recipient_id, notification_type, title, body, action_url, metadata)
    values (p_student_id, 'project_assigned', 'A project has been assigned to you',
      'Your project workspace is ready. Open it to review tasks, files and progress.',
      '/workspaces/' || v_workspace_id::text,
      jsonb_build_object('workspace_id', v_workspace_id, 'project_id', p_project_id));
  end if;

  return query select v_workspace_id, v_application_id, v_member_role;
end;
$$;
revoke all on function public.assign_project_to_student(uuid, uuid, text) from public, anon;
grant execute on function public.assign_project_to_student(uuid, uuid, text) to authenticated;

-- Create organization, private registration record and owner membership atomically.
create or replace function public.create_organization(
  p_display_name text,
  p_legal_name text,
  p_registration_type public.organization_registration_type,
  p_registration_identifier text,
  p_official_email text,
  p_description text default null,
  p_mission text default null,
  p_focus_areas text[] default '{}',
  p_city text default null,
  p_region text default null,
  p_website_url text default null
)
returns table (organization_id uuid, verification_status public.organization_verification_status)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_org_id uuid;
begin
  if v_user is null then raise exception using errcode = '28000', message = 'Authentication required'; end if;
  if char_length(trim(coalesce(p_display_name,''))) < 2 or char_length(trim(coalesce(p_legal_name,''))) < 2 then
    raise exception using errcode = '22023', message = 'Organization and legal names are required';
  end if;
  if char_length(trim(coalesce(p_registration_identifier,''))) < 2 then
    raise exception using errcode = '22023', message = 'Registration identifier is required';
  end if;
  if position('@' in coalesce(p_official_email,'')) < 2 then
    raise exception using errcode = '22023', message = 'A valid official email is required';
  end if;
  insert into public.organizations(display_name, description, mission, focus_areas, city, region,
    website_url, verification_status, project_posting_enabled, created_by)
  values (trim(p_display_name), p_description, p_mission, coalesce(p_focus_areas,'{}'), p_city, p_region,
    p_website_url, 'pending_review', false, v_user)
  returning id into v_org_id;

  insert into public.organization_private_records(organization_id, legal_name, registration_type,
    registration_identifier, official_email, registered_state, submitted_at)
  values (v_org_id, trim(p_legal_name), p_registration_type, trim(p_registration_identifier),
    lower(trim(p_official_email)), p_region, now());

  insert into public.organization_members(organization_id, user_id, role, status, joined_at)
  values (v_org_id, v_user, 'owner', 'active', now());

  return query select v_org_id, 'pending_review'::public.organization_verification_status;
end;
$$;
revoke all on function public.create_organization(text,text,public.organization_registration_type,text,text,text,text,text[],text,text,text) from public, anon;
grant execute on function public.create_organization(text,text,public.organization_registration_type,text,text,text,text,text[],text,text,text) to authenticated;

-- Invite a student to a workspace. Invitation acceptance does not grant access; NGO approval is separate.
create or replace function public.invite_workspace_student(
  p_workspace_id uuid,
  p_invitee_id uuid,
  p_invitation_message text default null
)
returns table (invitation_id uuid, invitation_status public.workspace_invitation_status)
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_invitation_id uuid;
begin
  if v_user is null then raise exception using errcode = '28000', message = 'Authentication required'; end if;
  if not private.can_manage_workspace(p_workspace_id, v_user) then
    raise exception using errcode = '42501', message = 'You cannot invite members to this workspace';
  end if;
  if p_invitee_id = v_user then raise exception using errcode = '22023', message = 'You cannot invite yourself'; end if;
  if not exists (select 1 from public.student_profiles s where s.user_id = p_invitee_id) then
    raise exception using errcode = '22023', message = 'Invitee is not an eligible student';
  end if;
  if private.is_workspace_member(p_workspace_id, p_invitee_id) then
    raise exception using errcode = '23505', message = 'Student is already a workspace member';
  end if;
  if exists (select 1 from public.project_members pm where pm.workspace_id = p_workspace_id and pm.status = 'active'
    and private.is_blocked_pair(pm.user_id, p_invitee_id)) then
    raise exception using errcode = '42501', message = 'This student cannot be invited because a current member has blocked them';
  end if;
  insert into public.workspace_invitations(workspace_id, invited_by, invitee_id, invitation_message, status)
  values (p_workspace_id, v_user, p_invitee_id, left(p_invitation_message,1000), 'pending')
  returning id into v_invitation_id;

  insert into public.notifications(recipient_id, notification_type, title, body, action_url, metadata)
  values (p_invitee_id, 'workspace_invitation', 'Workspace invitation received',
    'A project team invited you to collaborate. Accepting is followed by organization approval.',
    '/workspace-invitations/' || v_invitation_id::text, jsonb_build_object('invitation_id', v_invitation_id));

  insert into public.workspace_activity(workspace_id, actor_id, event_type, summary, details)
  values (p_workspace_id, v_user, 'member_invited', 'A student was invited to join the workspace',
    jsonb_build_object('invitation_id', v_invitation_id, 'invitee_id', p_invitee_id));

  return query select v_invitation_id, 'pending'::public.workspace_invitation_status;
end;
$$;
revoke all on function public.invite_workspace_student(uuid,uuid,text) from public, anon;
grant execute on function public.invite_workspace_student(uuid,uuid,text) to authenticated;

create or replace function public.respond_workspace_invitation(p_invitation_id uuid, p_accept boolean)
returns public.workspace_invitation_status
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_workspace_id uuid;
  v_status public.workspace_invitation_status;
begin
  if v_user is null then raise exception using errcode = '28000', message = 'Authentication required'; end if;
  select i.workspace_id, i.status into v_workspace_id, v_status
  from public.workspace_invitations i
  where i.id = p_invitation_id and i.invitee_id = v_user for update;
  if not found then raise exception using errcode = 'P0002', message = 'Invitation not found'; end if;
  if v_status <> 'pending' then raise exception using errcode = '22023', message = 'Invitation is no longer pending'; end if;

  update public.workspace_invitations
  set status = case when p_accept then 'accepted'::public.workspace_invitation_status else 'declined'::public.workspace_invitation_status end,
      responded_at = now()
  where id = p_invitation_id;

  insert into public.workspace_activity(workspace_id, actor_id, event_type, summary, details)
  values (v_workspace_id, v_user, case when p_accept then 'invitation_accepted' else 'invitation_declined' end,
    case when p_accept then 'A student accepted an invitation; organization approval is required' else 'A student declined an invitation' end,
    jsonb_build_object('invitation_id', p_invitation_id));

  return case when p_accept then 'accepted'::public.workspace_invitation_status else 'declined'::public.workspace_invitation_status end;
end;
$$;
revoke all on function public.respond_workspace_invitation(uuid,boolean) from public, anon;
grant execute on function public.respond_workspace_invitation(uuid,boolean) to authenticated;

create or replace function public.review_workspace_invitation(p_invitation_id uuid, p_approve boolean)
returns table (invitation_id uuid, invitation_status public.workspace_invitation_status)
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_workspace_id uuid;
  v_invitee_id uuid;
  v_status public.workspace_invitation_status;
begin
  if v_user is null then raise exception using errcode = '28000', message = 'Authentication required'; end if;
  select i.workspace_id, i.invitee_id, i.status into v_workspace_id, v_invitee_id, v_status
  from public.workspace_invitations i where i.id = p_invitation_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Invitation not found'; end if;
  if not private.is_workspace_ngo_manager(v_workspace_id, v_user) then
    raise exception using errcode = '42501', message = 'Only an authorized NGO representative can approve team membership';
  end if;
  if v_status <> 'accepted' then raise exception using errcode = '22023', message = 'Student must accept before NGO review'; end if;

  update public.workspace_invitations
  set status = case when p_approve then 'approved'::public.workspace_invitation_status else 'rejected'::public.workspace_invitation_status end,
      reviewed_by = v_user, reviewed_at = now()
  where id = p_invitation_id;

  if p_approve then
    if exists (select 1 from public.project_members pm where pm.workspace_id = v_workspace_id and pm.status = 'active'
      and private.is_blocked_pair(pm.user_id, v_invitee_id)) then
      raise exception using errcode = '42501', message = 'A current workspace member has blocked this student';
    end if;
    insert into public.project_members(workspace_id, user_id, role, status, added_by)
    values (v_workspace_id, v_invitee_id, 'student_collaborator', 'active', v_user)
    on conflict (workspace_id, user_id) do update set role = 'student_collaborator', status = 'active';
    insert into public.conversation_members(conversation_id, user_id, status)
    select c.id, v_invitee_id, 'active'
    from public.conversations c
    join public.project_workspaces w on w.project_id = c.project_id
    where w.id = v_workspace_id and c.type = 'project_group'
    on conflict (conversation_id, user_id) do update set status = 'active';
  end if;

  insert into public.notifications(recipient_id, notification_type, title, body, action_url, metadata)
  values (v_invitee_id, 'workspace_invitation_review',
    case when p_approve then 'Workspace access approved' else 'Workspace invitation declined by the organization' end,
    case when p_approve then 'You can now open the project workspace.' else 'The organization did not approve this workspace invitation.' end,
    case when p_approve then '/workspaces/' || v_workspace_id::text else '/workspace-invitations/' || p_invitation_id::text end,
    jsonb_build_object('invitation_id', p_invitation_id, 'workspace_id', v_workspace_id));

  insert into public.workspace_activity(workspace_id, actor_id, event_type, summary, details)
  values (v_workspace_id, v_user, case when p_approve then 'member_approved' else 'member_rejected' end,
    case when p_approve then 'A new student was approved for workspace access' else 'A proposed team member was not approved' end,
    jsonb_build_object('invitation_id', p_invitation_id, 'student_id', v_invitee_id));

  return query select p_invitation_id,
    case when p_approve then 'approved'::public.workspace_invitation_status else 'rejected'::public.workspace_invitation_status end;
end;
$$;
revoke all on function public.review_workspace_invitation(uuid,boolean) from public, anon;
grant execute on function public.review_workspace_invitation(uuid,boolean) to authenticated;

create or replace function public.submit_progress_update(
  p_workspace_id uuid,
  p_report_date date,
  p_completed_work text,
  p_next_steps text default null,
  p_blockers text default null,
  p_related_task_id uuid default null,
  p_github_url text default null
)
returns table (progress_update_id uuid, report_date date)
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_update_id uuid;
  v_existing boolean := false;
begin
  if v_user is null then raise exception using errcode = '28000', message = 'Authentication required'; end if;
  if not private.is_workspace_member(p_workspace_id, v_user) then
    raise exception using errcode = '42501', message = 'Workspace membership is required';
  end if;
  if p_related_task_id is not null and not exists (select 1 from public.workspace_tasks t
    where t.id = p_related_task_id and t.workspace_id = p_workspace_id) then
    raise exception using errcode = '22023', message = 'Related task does not belong to this workspace';
  end if;
  select pu.id into v_update_id from public.progress_updates pu
  where pu.workspace_id = p_workspace_id and pu.author_id = v_user
    and pu.report_date = coalesce(p_report_date, current_date) for update;
  v_existing := found;

  if v_existing then
    update public.progress_updates pu set completed_work = p_completed_work, next_steps = p_next_steps,
      blockers = p_blockers, related_task_id = p_related_task_id, github_url = p_github_url
    where pu.id = v_update_id;
  else
    insert into public.progress_updates(workspace_id, author_id, report_date, completed_work, next_steps, blockers, related_task_id, github_url)
    values (p_workspace_id, v_user, coalesce(p_report_date, current_date), p_completed_work, p_next_steps, p_blockers, p_related_task_id, p_github_url)
    returning id into v_update_id;
  end if;

  insert into public.workspace_activity(workspace_id, actor_id, event_type, summary, details)
  values (p_workspace_id, v_user, case when v_existing then 'progress_updated' else 'progress_submitted' end,
    case when v_existing then 'A daily progress update was edited' else 'A daily progress update was submitted' end,
    jsonb_build_object('progress_update_id', v_update_id, 'report_date', coalesce(p_report_date, current_date)));

  if not v_existing then
    insert into public.notifications(recipient_id, notification_type, title, body, action_url, metadata)
    select pm.user_id, 'progress_update', 'New project progress update',
      'A project member submitted a daily progress update.', '/workspaces/' || p_workspace_id::text,
      jsonb_build_object('workspace_id', p_workspace_id, 'progress_update_id', v_update_id)
    from public.project_members pm
    where pm.workspace_id = p_workspace_id and pm.status = 'active' and pm.user_id <> v_user;
  end if;

  return query select v_update_id, coalesce(p_report_date, current_date);
end;
$$;
revoke all on function public.submit_progress_update(uuid,date,text,text,text,uuid,text) from public, anon;
grant execute on function public.submit_progress_update(uuid,date,text,text,text,uuid,text) to authenticated;

create or replace function public.complete_project(p_workspace_id uuid)
returns table (project_id uuid, project_status public.project_status, workspace_status public.workspace_status)
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_project_id uuid;
  v_current_workspace_status public.workspace_status;
begin
  if v_user is null then raise exception using errcode = '28000', message = 'Authentication required'; end if;
  if not private.is_workspace_ngo_manager(p_workspace_id, v_user) then
    raise exception using errcode = '42501', message = 'Only an authorized NGO representative can complete the project';
  end if;
  select w.project_id, w.status into v_project_id, v_current_workspace_status
  from public.project_workspaces w where w.id = p_workspace_id for update;
  if not found then raise exception using errcode = 'P0002', message = 'Workspace not found'; end if;
  if v_current_workspace_status <> 'completed' then
    update public.projects p set status = 'completed', closed_at = coalesce(closed_at, now()) where p.id = v_project_id;
    update public.project_workspaces w set status = 'completed' where w.id = p_workspace_id;
    insert into public.workspace_activity(workspace_id, actor_id, event_type, summary, details)
    values (p_workspace_id, v_user, 'project_completed', 'The NGO marked the project as completed', jsonb_build_object('project_id', v_project_id));
  end if;
  return query select v_project_id, 'completed'::public.project_status, 'completed'::public.workspace_status;
end;
$$;
revoke all on function public.complete_project(uuid) from public, anon;
grant execute on function public.complete_project(uuid) to authenticated;

create or replace function public.submit_project_review(
  p_workspace_id uuid,
  p_student_id uuid,
  p_overall_rating smallint,
  p_quality_rating smallint default null,
  p_reliability_rating smallint default null,
  p_communication_rating smallint default null,
  p_teamwork_rating smallint default null,
  p_written_review text default null
)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_project_id uuid;
  v_org_id uuid;
  v_review_id uuid;
begin
  if v_user is null then raise exception using errcode = '28000', message = 'Authentication required'; end if;
  if not private.is_workspace_ngo_manager(p_workspace_id, v_user) then
    raise exception using errcode = '42501', message = 'Only the authorized NGO representative can review project work';
  end if;
  select w.project_id, w.organization_id into v_project_id, v_org_id
  from public.project_workspaces w where w.id = p_workspace_id and w.status = 'completed';
  if not found then raise exception using errcode = '22023', message = 'Project must be completed before reviewing'; end if;
  if not exists (select 1 from public.project_members pm where pm.workspace_id = p_workspace_id
    and pm.user_id = p_student_id and pm.status = 'active' and pm.role in ('student_lead','student_collaborator')) then
    raise exception using errcode = '22023', message = 'Student must be an active member of the completed project';
  end if;
  insert into public.project_reviews(project_id, workspace_id, reviewer_id, reviewer_organization_id,
    reviewee_student_id, overall_rating, quality_rating, reliability_rating, communication_rating, teamwork_rating, written_review)
  values (v_project_id, p_workspace_id, v_user, v_org_id, p_student_id, p_overall_rating,
    p_quality_rating, p_reliability_rating, p_communication_rating, p_teamwork_rating, p_written_review)
  returning id into v_review_id;
  insert into public.notifications(recipient_id, notification_type, title, body, action_url, metadata)
  values (p_student_id, 'project_review', 'New project review', 'An NGO submitted feedback on your completed project.',
    '/profile/' || p_student_id::text, jsonb_build_object('review_id', v_review_id, 'project_id', v_project_id));
  return v_review_id;
end;
$$;
revoke all on function public.submit_project_review(uuid,uuid,smallint,smallint,smallint,smallint,smallint,text) from public, anon;
grant execute on function public.submit_project_review(uuid,uuid,smallint,smallint,smallint,smallint,smallint,text) to authenticated;

-- RLS-aware rating summary. Do not accept client-supplied average scores.
create or replace view public.student_rating_summary
with (security_invoker = true)
as
select reviewee_student_id as student_id,
       round(avg(overall_rating)::numeric, 2) as average_rating,
       count(*)::integer as review_count
from public.project_reviews
where status = 'published'
group by reviewee_student_id;
grant select on public.student_rating_summary to authenticated;

-- Buckets: public covers contain non-sensitive media; documents and messages are private.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-covers', 'project-covers', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('message-attachments', 'message-attachments', false, 20971520, array['image/jpeg','image/png','image/webp','application/pdf','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('workspace-files', 'workspace-files', false, 52428800, array['image/jpeg','image/png','image/webp','application/pdf','text/plain','application/zip','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('organization-documents', 'organization-documents', false, 20971520, array['application/pdf','image/jpeg','image/png'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy project_cover_insert_org_manager on storage.objects for insert to authenticated
  with check (bucket_id = 'project-covers' and private.can_manage_org(private.safe_uuid_from_path(name, 1)));
create policy project_cover_delete_org_manager on storage.objects for delete to authenticated
  using (bucket_id = 'project-covers' and private.can_manage_org(private.safe_uuid_from_path(name, 1)));
create policy message_attachment_read_conversation_member on storage.objects for select to authenticated
  using (bucket_id = 'message-attachments' and private.is_conversation_member(private.safe_uuid_from_path(name, 1)));
create policy message_attachment_insert_conversation_member on storage.objects for insert to authenticated
  with check (bucket_id = 'message-attachments' and private.is_conversation_member(private.safe_uuid_from_path(name, 1)));
create policy message_attachment_delete_owner_or_admin on storage.objects for delete to authenticated
  using (bucket_id = 'message-attachments' and (owner_id = (select auth.uid())::text or private.is_platform_admin()));
create policy workspace_file_read_member on storage.objects for select to authenticated
  using (bucket_id = 'workspace-files' and private.is_workspace_member(private.safe_uuid_from_path(name, 1)));
create policy workspace_file_insert_member on storage.objects for insert to authenticated
  with check (bucket_id = 'workspace-files' and private.is_workspace_member(private.safe_uuid_from_path(name, 1)));
create policy workspace_file_delete_owner_or_manager on storage.objects for delete to authenticated
  using (bucket_id = 'workspace-files' and (owner_id = (select auth.uid())::text or private.can_manage_workspace(private.safe_uuid_from_path(name, 1))));
create policy org_documents_read_org_members on storage.objects for select to authenticated
  using (bucket_id = 'organization-documents' and (private.can_manage_org(private.safe_uuid_from_path(name, 1)) or private.is_platform_admin()));
create policy org_documents_insert_org_manager on storage.objects for insert to authenticated
  with check (bucket_id = 'organization-documents' and private.can_manage_org(private.safe_uuid_from_path(name, 1)));
create policy org_documents_delete_org_manager on storage.objects for delete to authenticated
  using (bucket_id = 'organization-documents' and private.can_manage_org(private.safe_uuid_from_path(name, 1)));

-- Important implementation notes:
-- 1. Functions that write organizations, verification checks, projects, applications, messages, workspaces,
--    invites, tasks, progress, files, reviews, reports, calls, and notifications must validate the JWT actor
--    and permission before using a server credential. Never trust client-supplied user IDs or role fields.
-- 2. Keep private schema out of Supabase's exposed schemas.
-- 3. Review Storage path conventions and policies before production; prefer signed URLs for private objects.
-- 4. Create pgTAP tests for both allowed and denied RLS paths before integration.
