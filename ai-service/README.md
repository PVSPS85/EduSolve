# EduSolve AI Service (`ai-service`)

The private AI agent orchestration and inference backend for the EduSolve platform.

## 1. Purpose

The EduSolve AI Service is an internal, private microservice designed to provide advisory intelligence for the EduSolve platform without granting autonomous decision-making power to AI models. 

Key responsibilities:
- **Conversation Assistance**: Contextual summaries for student–NGO project conversations (`/internal/v1/chat-summary`).
- **Student Profile Intelligence**: Pre-authorized student profile analysis and target project alignment for NGO evaluators (`/internal/v1/summarize-student-profile`).
- **NGO Profile Intelligence**: Pre-authorized NGO organization and mission transparency analysis for student volunteers (`/internal/v1/summarize-ngo-profile`).
- **Problem Structuring**: Assisting NGOs in scoping ambiguous community problems into concrete technical deliverables and skill requirements (`/internal/v1/problem-structure`).
- **Opportunity Recommendations**: Evidence-based project suggestions based on student skills and focus areas (`/internal/v1/project-recommendations`).

## 2. Architecture & Security Boundary

```text
┌────────────────────────────────┐
│  React Frontend (Browser)       │
└───────────────┬────────────────┘
                │ User JWT
                ▼
┌────────────────────────────────┐
│  Supabase Edge Functions        │
│  (Auth, Scoping & Validation)  │
└───────────────┬────────────────┘
                │ X-Internal-Secret (S2S Auth)
                ▼
┌────────────────────────────────┐
│  EduSolve AI Service (FastAPI) │
│  - /health (Public Probe)      │
│  - /internal/v1/* (Protected)  │
└───────────────┬────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
   Fast LLM Call      CrewAI Multi-Agent
   (Summaries)        (Problem Scoping)
```

### Security & Privacy Rules
- **No Direct Browser Access**: The AI service runs in a private network and is only accessible by Supabase Edge Functions.
- **Service-to-Service Authentication**: Calls must provide the `X-Internal-Secret` header matching `AI_SERVICE_SHARED_SECRET`.
- **Least Privilege Context**: The AI service has no direct database credentials; Edge Functions pass only the minimal authorized fields.
- **Zero Autonomous Execution**: AI agents never approve NGOs, assign projects, or create ratings.
- **Structured Error Envelope**: All errors follow the project standard defined in `Tech/openapi.yaml`:
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Missing or invalid authentication credentials.",
      "request_id": "correlation-uuid"
    }
  }
  ```

## 3. Directory Layout

```text
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entrypoint & middleware
│   ├── config.py            # Pydantic Settings configuration
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # Internal S2S authentication dependency
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── router.py    # Internal v1 API routes (/internal/v1/*)
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py      # Constant-time comparison & domain exceptions
│   │   └── logging.py       # JSON structured logging with redaction
│   └── schemas/
│       ├── __init__.py
│       └── common.py        # ErrorEnvelope, HealthResponse, PingResponse
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures & mock environment
│   ├── test_health.py       # Health probe tests
│   ├── test_security.py     # Authentication & secret protection tests
│   └── test_errors.py       # ErrorEnvelope contract adherence tests
├── .env.example             # Safe template for environment variables
├── .gitignore               # Git ignore rules for Python & venv
├── Dockerfile               # Multi-stage production container definition
├── pyproject.toml           # Package metadata and dependencies
└── README.md                # Service documentation
```

## 4. Local Setup

### Prerequisites
- Python 3.11+
- Virtual environment tool (`venv`)
- Docker (optional, for containerized execution)

### 1. Create Virtual Environment
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install --upgrade pip
pip install -e ".[dev]"
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set a development secret for `AI_SERVICE_SHARED_SECRET`:
```env
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000
LOG_LEVEL=INFO
AI_SERVICE_SHARED_SECRET=local-dev-secret-12345
```

### 4. Run the Service Locally
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Root health probe: `http://localhost:8000/health`
- Internal health probe: `http://localhost:8000/internal/v1/health`
- Protected verification endpoint: `http://localhost:8000/internal/v1/ping`
  ```bash
  curl -H "X-Internal-Secret: local-dev-secret-12345" http://localhost:8000/internal/v1/ping
  ```

## 5. Running Automated Tests

Run the test suite using pytest:
```bash
pytest -v
```

All tests mock external interactions and run without requiring external network access or LLM API keys.

## 6. Running with Docker

### 1. Build the Docker Image
```bash
docker build -t edusolve-ai-service .
```

### 2. Run the Container
```bash
docker run -p 8000:8000 \
  -e APP_ENV=production \
  -e AI_SERVICE_SHARED_SECRET=your-shared-secret \
  edusolve-ai-service
```

### 3. Verify Health
```bash
curl http://localhost:8000/health
```

## 7. AI Endpoints & Edge Function Integration

### `POST /internal/v1/chat-summary`

Provides role-aware conversation context synthesis for student–NGO project chats without granting autonomous decision-making power.

#### Calling from Supabase Edge Function (`ai-chat-summary`)

The Supabase Edge Function authenticates the caller's JWT, verifies conversation membership, constructs the pre-authorized context from PostgreSQL, and invokes this private endpoint:

```typescript
// Example snippet inside supabase/functions/ai-chat-summary/index.ts
const response = await fetch(`${Deno.env.get("AI_SERVICE_URL")}/internal/v1/chat-summary`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Internal-Secret": Deno.env.get("AI_SERVICE_SHARED_SECRET")!,
  },
  body: JSON.stringify({
    viewer_role: viewerRole, // derived server-side: 'ngo_representative' | 'student'
    project: authorizedProjectDetails,
    other_party_profile: authorizedProfileDetails,
    recent_messages: recentConversationMessages,
    question: optionalUserQuestion,
  }),
});
const summaryResult = await response.json();
```

#### Request Payload (`AiChatSummaryRequest`)

```json
{
  "viewer_role": "ngo_representative",
  "project": {
    "id": "7d707134-9203-4726-abe7-76df7fe11ab5",
    "title": "Digital Literacy Tracker for Rural Schools",
    "problem_statement": "Need a lightweight offline-first tracking application for student attendance across rural Karnataka centers.",
    "category": "Education",
    "required_skills": ["React", "TypeScript", "IndexedDB", "PWA"],
    "expected_deliverables": ["Offline web app", "Data sync module", "User documentation"],
    "weekly_commitment_hours": 8.0,
    "duration_weeks": 6,
    "work_mode": "remote"
  },
  "other_party_profile": {
    "display_name": "Aarav Sharma",
    "bio": "3rd year Computer Science student passionate about community education and frontend development.",
    "skills": ["React", "JavaScript", "HTML/CSS", "Git"],
    "institution_name": "Bangalore Institute of Technology",
    "degree": "B.Tech Computer Science",
    "study_year": 3,
    "portfolio_items": [
      {
        "title": "Community Library Catalog",
        "technologies": ["React", "TailwindCSS"],
        "url": "https://github.com/example/library"
      }
    ]
  },
  "recent_messages": [
    {
      "sender_role": "student",
      "body": "Hello! I am very interested in this project. I built a React catalog before.",
      "sent_at": "2026-11-20T10:00:00Z"
    },
    {
      "sender_role": "ngo_representative",
      "body": "Great to meet you Aarav. Have you worked with IndexedDB or offline data sync before?",
      "sent_at": "2026-11-20T10:05:00Z"
    }
  ],
  "question": "Does Aarav have sufficient frontend skills for our MVP and what should we clarify?"
}
```

#### Response Payload (`AiChatSummaryResponse`)

Adheres strictly to `AiChatSummaryResponse` defined in `Tech/openapi.yaml`:

```json
{
  "summary": "Aarav demonstrates strong React fundamentals matching the UI needs, but lacks direct IndexedDB experience required for offline sync.",
  "relevant_evidence": [
    "Profile confirms React and JavaScript skills",
    "Built a community library catalog using React",
    "Expressed strong enthusiasm and willingness to learn in conversation"
  ],
  "missing_information": [
    "No direct IndexedDB or PWA offline sync experience in profile or conversation",
    "Formal weekly commitment (8 hrs/week) not yet explicitly confirmed in chat"
  ],
  "suggested_questions": [
    "Are you comfortable dedicating time during week 1 to research IndexedDB libraries?",
    "Can you confirm you can commit 8 hours per week alongside your coursework?"
  ],
  "disclaimer": "AI assistance is an advisory summary. Please verify all key requirements directly with the other party."
}
```

---

### `POST /internal/v1/summarize-student-profile`

Provides structured analysis of a student applicant's background, distinguishing self-reported skills from documented portfolio evidence, with optional alignment against target project requirements.

#### Request Payload (`AiStudentProfileSummaryRequest`)

```json
{
  "profile": {
    "display_name": "Priya Nair",
    "bio": "Passionate 3rd-year CS student focusing on web accessibility and offline education tools.",
    "institution_name": "National Institute of Technology Karnataka",
    "degree": "B.Tech Computer Science",
    "study_year": 3,
    "availability": "available",
    "availability_hours_per_week": 10,
    "preferred_work_mode": "remote",
    "skills": [
      {"skill_name": "React", "proficiency": "advanced"},
      {"skill_name": "TypeScript", "proficiency": "intermediate"},
      {"skill_name": "Python", "proficiency": "intermediate"}
    ],
    "portfolio_items": [
      {
        "title": "Literacy Bridge PWA",
        "url": "https://github.com/priyanair/literacy-bridge",
        "technologies": ["React", "TypeScript", "IndexedDB"]
      }
    ]
  },
  "target_project_requirements": {
    "title": "Digital Curriculum Portal for Rural Schools",
    "required_skills": ["React", "TypeScript", "TailwindCSS"],
    "deliverables": ["Web portal", "Documentation"]
  }
}
```

#### Response Payload (`AiStudentProfileSummaryResponse`)

```json
{
  "profile_summary": "Priya Nair is a 3rd-year CS student with demonstrated practical experience in React and TypeScript.",
  "key_skills": [
    "React (Advanced, Demonstrated in Literacy Bridge PWA)",
    "TypeScript (Intermediate, Demonstrated in Literacy Bridge PWA)",
    "Python (Intermediate, Self-reported)"
  ],
  "portfolio_evidence": [
    "Literacy Bridge PWA (https://github.com/priyanair/literacy-bridge): Demonstrates React, TypeScript, and IndexedDB offline syncing."
  ],
  "relevant_strengths": [
    "Demonstrated practical experience building progressive web apps",
    "Strong match for the target project's React and TypeScript requirements"
  ],
  "missing_information": [
    "No portfolio evidence provided for TailwindCSS",
    "No details on backend database deployment experience"
  ],
  "suggested_questions": [
    "Can you share more about how you implemented offline data sync in Literacy Bridge?",
    "Have you used TailwindCSS or modern utility-first CSS in any projects?"
  ],
  "disclaimer": "AI assistance is an advisory summary. Please verify all key requirements and qualifications directly with the student."
}
```

---

### `POST /internal/v1/summarize-ngo-profile`

Provides transparent, objective intelligence on an NGO organization's focus, mission, past projects, and backend verification status for prospective student volunteers.

#### Request Payload (`AiNgoProfileSummaryRequest`)

```json
{
  "organization": {
    "display_name": "Akshaya Shiksha Foundation",
    "description": "Grassroots non-profit focused on accelerating digital literacy for underprivileged rural youth across Karnataka.",
    "mission": "To ensure every rural schoolchild has access to digital tools, modern pedagogy, and career guidance.",
    "focus_areas": ["Digital Literacy", "Rural Education", "Youth Empowerment"],
    "city": "Mysuru",
    "region": "Karnataka",
    "country": "India",
    "website_url": "https://akshayashiksha.org",
    "public_contact_email": "contact@akshayashiksha.org",
    "verification_status": "verified",
    "past_projects_summary": [
      {
        "title": "Supplied refurbished tablets to 45 rural learning centers",
        "category": "Hardware Donation",
        "status": "completed"
      }
    ]
  },
  "student_interests": ["Digital Literacy", "Education", "React"]
}
```

#### Response Payload (`AiNgoProfileSummaryResponse`)

```json
{
  "organization_summary": "Akshaya Shiksha Foundation is a verified grassroots non-profit dedicated to accelerating digital literacy for rural students.",
  "mission_and_focus": [
    "Ensure rural schoolchildren have access to digital tools, modern pedagogy, and career guidance",
    "Digital Literacy",
    "Rural Education",
    "Youth Empowerment"
  ],
  "verification_analysis": "The organization's backend verification status is recorded as 'verified'.",
  "relevant_evidence": [
    "Supplied refurbished tablets to 45 rural learning centers in 2025.",
    "Active public web presence at https://akshayashiksha.org"
  ],
  "alignment_analysis": [
    "High alignment with students interested in digital literacy and rural education",
    "Offers practical opportunities to apply software skills for social impact"
  ],
  "missing_information": [
    "Details on upcoming technical architecture and software volunteer needs"
  ],
  "suggested_questions": [
    "What upcoming software development initiatives are currently planned for volunteers?",
    "What mentorship and guidance is provided to student contributors during the engagement?"
  ],
  "disclaimer": "AI assistance is an advisory summary. Verification status is supplied by platform records. Verify all details directly with the organization."
}
```

#### LLM Provider Configuration

The service uses a provider abstraction (`BaseLLMProvider`). Configure in `.env`:
- `LLM_PROVIDER`: `gemini` (Google GenAI) or `openai` (OpenAI API).
- `LLM_MODEL`: e.g. `gemini-2.5-flash` or `gpt-4o-mini`.
- `LLM_API_KEY`: API secret for the selected provider.
- During testing or when set to `mock`, `MockLLMProvider` is used without network calls or external billing.

