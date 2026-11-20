# EduSolve

A collaborative platform connecting students with verified NGOs to tackle community challenges in education and digital literacy.

## Frontend Project Structure

```text
frontend/src/
├── components/
│   ├── auth/           # Login, registration, and onboarding screens
│   ├── chat/           # Messaging, call dialogs, and AI context panel
│   ├── feed/           # Project feed, filters, search, and application modals
│   ├── landing/        # Landing page sections (Hero, HowItWorks, BothSides, Explore, Trust, FinalCTA)
│   ├── layout/         # Shell components (Navbar, Footer, RoleModal, PolicyModal)
│   ├── ngo/            # NGO problem posting and management
│   ├── profile/        # Student and NGO public/private profiles
│   ├── ui/             # Reusable UI primitives (Button, Card, Modal, Badge, SkillTag, icons)
│   └── workspace/      # Collaborative workspaces (tasks, progress, team, files)
├── data/               # Mock datasets and initial presets
├── services/           # Backend API integration layer (auth, projects, workspaces)
├── theme/              # Design tokens and themes
├── App.tsx             # Root application orchestrator
├── router.tsx          # React Router configuration
├── main.tsx            # React 19 DOM entrypoint
├── types.ts            # TypeScript interfaces & types
└── index.css           # Tailwind CSS v4 & global styles
```

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

The app starts at **http://localhost:5173/**.
API requests made to `/api/*` are proxied to the backend at `http://localhost:5000`.
