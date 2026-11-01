# EduSolve Team Branch & Integration Contract

## Branches

- `feature/frontend`: React/TypeScript UI and typed client integration.
- `feature/database`: SQL migrations, RLS policies, indexes, test fixtures and database documentation.
- `feature/backend`: Supabase Edge Functions, Resend and permitted verification-source integrations.
- `feature/ai-agents`: Python/FastAPI/CrewAI service and internal AI request/response schemas.
- `integration`: the integration lead's branch for bringing approved modules together.
- `main`: validated project baseline only.

## Rules for every workstream

1. Pull the latest agreed branch baseline before starting.
2. Do not edit another workstream's owned files without coordinating first.
3. Read `docs/API_CONTRACT.md` and `docs/DATABASE_SCHEMA.md` before implementation.
4. If a field, enum, RPC parameter, response type, environment variable or route needs to change, update the contract and notify the affected owners before merging.
5. Use dummy/seed data only; never commit credentials, real personal data, NGO registration documents or API tokens.
6. Add tests and update the relevant README/run instructions.
7. Open a pull request against `integration`, not directly against `main`.
8. Integration lead reviews, runs migrations/tests, validates end-to-end flows and merges to `main` only after checks pass.

## Suggested repository layout

```text
edusolve/
├── src/                         # Frontend (React + TypeScript)
├── public/
├── supabase/
│   ├── config.toml
│   ├── migrations/              # Database branch owns migrations
│   ├── functions/               # Backend branch owns Edge Functions
│   └── tests/                   # pgTAP/RLS tests
├── ai-service/                  # AI branch owns Python/FastAPI/CrewAI
├── docs/
│   ├── API_CONTRACT.md
│   ├── DATABASE_SCHEMA.md
│   └── TEAM_BRANCH_CONTRACT.md
├── openapi.yaml
├── .env.example                 # Placeholders only; never real keys
└── README.md
```

## Integration order

1. Review API/schema contract changes.
2. Merge database migrations and RLS tests into `integration` first.
3. Run local Supabase migrations and database tests.
4. Merge backend Edge Functions against the actual schema/RPC signatures.
5. Merge AI service and verify Edge Function-to-AI contracts.
6. Merge frontend and verify the UI uses the agreed types and routes.
7. Run end-to-end scenarios: signup; NGO registration and verification; project publication; student application; chat; project assignment; workspace creation; invite/approval; daily progress; file access; completion; rating in profile/chat.
8. Run negative tests for unauthorised access and invalid state transitions.
9. Merge `integration` to `main` only after all required checks pass.
