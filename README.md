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

---

## Running with Docker (Recommended for any OS)

Docker ensures the frontend runs identically on any machine (Windows, macOS, Linux) without worrying about Node.js or dependency versions.

### 1. Using Docker Compose (Single Command)

From the root project folder:

```bash
docker compose up --build
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Using Docker Directly

```bash
# Build the image
docker build -t edusolve-frontend ./frontend

# Run the container
docker run -p 3000:80 edusolve-frontend
```

Then open **[http://localhost:3000](http://localhost:3000)**.

---

## Running Locally (without Docker)

Prerequisites: Node.js 18+ or 20+

```bash
cd frontend
npm install
npm run dev
```

The app starts at **http://localhost:5173/**.
API requests made to `/api/*` are proxied to the backend at `http://localhost:5000`.
