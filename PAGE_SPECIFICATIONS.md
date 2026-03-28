# Dock0de Page Specifications

This document references the design tokens and layout rules in UI_UX_GUIDE.md and the system flow in ARCHITECTURE.md. All pages use Manrope, 1px borders, 12-14px radii, and the bento-grid layout style using inline `React.CSSProperties` arrays to maintain pure component files without rely of external class injections.

## 1. Auth Gateway (/auth)
Visual Layout
- Centered single card on a calm off-white background (#F7F7F5).
- Card width 420-480px, padding 24px, 1px border (#E5E5E0), 14px radius.

Core Components
- Dual-tab switch: "Login" and "Register".
- Inputs: email, password (12px radius, 36px height).
- Primary button: "Continue" in Accent (#2E3A8C).

Interaction Logic
- Tab switch swaps form fields and submit endpoint.
- "Continue" triggers auth request and shows inline validation errors.

Data Requirements
- POST /auth/login or POST /auth/register.

## 2. Student Dashboard (/student)
Visual Layout
- 12-column bento grid with 24px gutters, 24px page padding.
- Top row: "My Classes" cards (1x1) with year/section labels.
- Lower section: Activity Timeline (vertical list) for the selected class.

Core Components
- Class Cards: Year Level, Section, Enrollment status.
- Activity Timeline: vertical list of assignments with submission status and professor feedback/grade.
- Contextual "Submit Work" button on each timeline row.

Interaction Logic
- Selecting a class updates the Activity Timeline context.
- "Submit Work" opens the Upload Portal prefilled with class/activity.
- Timeline items show latest submission status and professor feedback/grade.
- Activity row opens the Dock for the student submission.

Data Requirements
- GET /student/classes
- GET /student/classes/:id/activities
- POST /classes/join (inviteCode)

Sidebar Behavior
- Student sidebar lists "My Classes" only (no year-level accordion).

## 3. Professor Dashboard (/professor)
Visual Layout
- 12-column bento grid with class-wide metrics and a class list table.

Core Components
- Bento Cards: "Active Classes", "Submissions Needing Review", "System Status".
- Class table: Year, Section, Students, Active Activities, "Open" button.

Interaction Logic
- "Open" navigates to /professor/class/:id.

Data Requirements
- GET /professor/metrics
- GET /professor/classes

## 4. Class View (/professor/class/:id)
Visual Layout
- Horizontal tab bar with three tabs: Metrics, Activities, Students.

Core Components
- Tabs: [Metrics], [Activities], [Students].
- Metrics tab: completion rate, top 3 ESLint errors, running containers.
- Activities tab: activity list with Max Score + Action column and "Create Activity" primary button.
- Students tab: roster table with status badges.

Interaction Logic
- Tabs switch within the same route (no sidebar changes).
- Activities tab "Create Activity" opens modal with Title, Description, Due Date, Max Score.

Theme Selector Behavior
- Users can switch between four UI styles (Default, Cyber, Glass, Command) from the header.
- Modals, cards, badges, and tables must reflect the active theme.

Data Requirements
- GET /professor/classes/:id/metrics
- GET /professor/classes/:id/activities
- GET /professor/classes/:id/students

## 5. Activity Archive (/professor/class/:id/activities)
Visual Layout
- Wide table card with search and filters.

Core Components
- Search bar, status filter, date range filter.
- Activity list rows with isolated "Open Matrix" button components (wrapped in parent `<div>` to avoid grid stretching).

Interaction Logic
- "Open Matrix" navigates to /professor/class/:id/activities/:activityId.

Data Requirements
- GET /professor/classes/:id/activities (paginated)

## 6. Submission Matrix (/professor/class/:id/activities/:activityId)
Visual Layout
- Columnar submissions table with headers: Student, Score, Date Submitted, Environment, Status.

Core Components
- Status pill per row with labels: GRADED, PENDING REVIEW, NO SUBMISSION.

Interaction Logic
- Clicking a cell opens /dock/:submissionId.

Data Requirements
- GET /professor/activities/:activityId/matrix

## 7. Upload Portal (/upload)
Visual Layout
- Full-screen focus mode with centered panel, minimal chrome.

Core Components
- Dropzone for .zip uploads with file name preview.
- Environment selector dropdown: "React/Vite", "Node.js", "Java".

Interaction Logic
- Real-time validation: only .zip accepted; error in #9B1C1C.

Data Requirements
- POST /runs (multipart: zip + environment + activityId)

## 8. The Dock Workspace (/dock/:id)
Visual Layout
- Split-pane layout: 60/40 horizontal (desktop) or 50/50 vertical (wide screens).
- Left pane: tabbed audit card; right pane: live preview card.
- Floating grading action bar anchored to bottom for professor actions.

Core Components
- Tabs: "Build Logs" and "Health Report".
- Build Logs: monospaced terminal card, streaming SSE text.
- Health Report: visual breakdown of ESLint/Snyk results with badges.
- Live Preview: iframe inside a 14px radius card, 1px border.
- Action bar (professor only): score input + comment + "Submit Grade" button.

Interaction Logic
- SSE stream starts on page load and appends to log terminal.
- Preview iframe loads /preview/:id proxy route; shows fallback on failure.

Data Requirements
- GET /runs/:id (status, metadata, environment, ports).
- GET /runs/:id/logs (SSE).
- GET /runs/:id/report (lint/vuln results).
- POST /runs/:id/grade (score, comment).

## 9. Sandbox (Professor Quick Access) (/sandbox)
Visual Layout
- Dropzone row above a wide table card.

Core Components
- Quick Test dropzone (creates isTestRun submissions).
- Search input, status filter, "Open Dock" action button.

Interaction Logic
- Uploading in Sandbox creates a test run and redirects to /dock/:id.
- "Open Dock" navigates to /dock/:submissionId.

Data Requirements
- POST /runs/test (multipart: zip + environment).
- GET /professor/sandbox (latest test runs).
