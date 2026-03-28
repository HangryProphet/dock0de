# Dock0de Architecture Blueprint

## High-Level System Overview
Dock0de is a class- and activity-based code execution sandbox for IT professors. Professors create classes, publish activities, and share a 6-digit class code for student enrollment. Students submit a .zip to a specific activity via contextual "Submit Work" actions. Professors can run quick private tests via the Sandbox without affecting class analytics. The system extracts, builds, and runs submissions in isolated Docker containers, streams logs, and proxies a live preview in the Dock workspace. Each run is short-lived and cleaned after grading.

## Tech Stack Selection
### Frontend (Mandatory)
- React + Vite + TypeScript
- UI: Mantine (fast to ship, good defaults, free)
- Styling Strict Rules: Tailwind has been removed. UI relies on strict Mantine properties, `useMediaQuery` for responsiveness, and TSX `React.CSSProperties` objects. Avoid global `.css` files.
- State/Data: TanStack Query + Zustand
- Networking: native fetch + SSE for log streaming

### Backend (Recommended Override)
**Use Fastify instead of Express.**
- Why: faster, less boilerplate, excellent TypeScript support, good plugin ecosystem, and built-in schema validation. This is more modern and reduces time-to-ship for a 2-month capstone.
- Framework: Fastify + TypeScript
- Routing/Validation: fastify-type-provider-zod + zod
- File Uploads: @fastify/multipart
- Realtime: Server-Sent Events (SSE) for logs and status

### Database
- **SQLite + Prisma** (default)
  - Zero config, free, works well for single-machine deployments.
- Optional upgrade: PostgreSQL (still free; easy migration if needed).

### Sandbox / Execution Layer
- Docker Engine + dockerode
- Build/runtime isolation: per-run container with resource limits
- Zip extraction: unzipper
- Security: non-root container user, CPU/memory limits, timeouts

### Supporting Libraries
- Queueing: BullMQ (optional for background jobs)
- Auth (optional): simple password-based professor login or GitHub OAuth

## System Data Flow (Core Feature)
1. Professor creates a class (year level + section) and receives a 6-digit class code.
2. Students join the class using the code (Enrollment).
3. Professor creates an activity within the class.
4. Student submits a .zip via the Activity Timeline row (contextual Submit Work).
5. Professor can optionally create a private Sandbox test run (isTestRun = true).
6. Backend stores the zip to a temp working directory.
7. Backend extracts the zip to a sandbox build folder.
8. Backend generates a Dockerfile template (or uses provided Dockerfile if present).
9. Backend builds a Docker image for the submission.
10. Backend runs a container with CPU/memory/time limits.
11. Backend streams build/run logs to the frontend via SSE.
12. Frontend shows container logs and proxies the app preview in the Dock workspace.
13. Backend exposes a proxied container port for live preview.
14. Every Dock view is logged to AuditLog for professor accountability.
15. After grading or timeout, backend stops and removes the container and image.
16. Backend cleans temp files and marks the run complete in the database.

## Navigation Model (Teams-Style Tabs)
- Professor Dashboard -> Class View (tabs: Metrics, Activities, Students) -> Activity Submissions -> Dock
- Contextual actions replace global uploads to reduce sidebar clutter.

## Activity-First Flow Notes
- Activities open a full roster submissions view for that assignment.
- Submissions list shows Student, Score, Date Submitted, Environment, Status.
- Status labels: GRADED, PENDING REVIEW, NO SUBMISSION.
- Dock grading bar shows Score / Max Score from the Activity.

## Proposed Folder Structure
Monorepo structure (recommended):

```
Dock0de/
  apps/
    web/                 # React + Vite + TS frontend
    api/                 # Fastify + TS backend
  packages/
    shared/              # Shared types, DTOs, utils
  infra/
    docker/              # Docker templates, base images, scripts
  prisma/
    schema.prisma
  docs/
    ARCHITECTURE.md
  .env.example
  package.json
  pnpm-workspace.yaml
```

## Notes
- isTestRun submissions are excluded from class/activity metrics.
- Use SSE for logs to simplify realtime streaming.
- Keep containers short-lived and aggressively cleaned.
- Prefer minimal base images for speed and safety.
- Treat class codes as short-lived secrets; rotate on demand.
