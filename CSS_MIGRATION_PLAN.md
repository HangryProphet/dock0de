# Dock0de Style Migration Plan (Mantine-First, No New CSS Files)

## Objective
Eliminate app-level handwritten CSS by migrating visual styling into Mantine theme configuration and TSX-based component styles, without intentional visual regressions.

## Hard Rules
- Do not create new page-level or component-level .css files.
- Do not split global CSS into many smaller CSS files.
- Prefer Mantine theme tokens, style props, and TSX style objects.
- Keep visual output and behavior as close as possible while migrating.
- Ship in small, reversible phases.

## Current Baseline
- Existing global stylesheet: apps/web/src/index.css
- App-level style import lives in apps/web/src/main.tsx
- Many screens still depend on className selectors from index.css
- Mantine is already installed and configured

## Target End State
- Styling owned by:
  - Mantine theme (tokens, defaults, component-level variants)
  - TSX component style objects and Mantine style props
- No page/component CSS files in app source
- Global CSS reduced to zero or near-zero transitional footprint
- Tailwind directives removed once no longer needed

## Safety Controls
1. Baseline snapshots
- Keep before/after screenshots per migrated domain.

2. Isolation
- One domain per phase.
- No unrelated refactors in the same phase.

3. Verification gate (required per phase)
- `pnpm --filter web build` passes.
- No TypeScript or lint errors in changed files.
- Manual parity checks for desktop/mobile and Default/Cyber/Glass themes.

4. Rollback
- Revert only the current phase if visual drift is unacceptable.

## Migration Phases

### Phase 0: Plan and Mapping
Scope:
- Document migration strategy and ownership map.

Status:
- Completed.

### Phase 1: Landing + Auth Domain
Scope:
- Move landing and related visual classes to TSX-based styles.
- Keep Auth in Mantine-only layout approach.

Files:
- apps/web/src/pages/LandingPage.tsx
- apps/web/src/components/LetterGlitch.tsx
- apps/web/src/pages/AuthPage.tsx
- apps/web/src/index.css (remove migrated selectors)

Acceptance:
- Landing visuals and flow remain consistent.
- Auth page remains unchanged visually.
- No landing/letter-glitch selector dependency in index.css.

Status:
- Completed.

### Phase 2: Layout + Sidebar Shell
Scope:
- Migrate layout and sidebar selector groups into TSX/Mantine styles.

Files:
- apps/web/src/layouts/AppLayout.tsx
- apps/web/src/components/Sidebar.tsx
- apps/web/src/index.css

Acceptance:
- Sidebar collapse, active state, and spacing remain stable.

Status:
- Completed.

### Phase 3: Professor Surfaces
Scope:
- Migrate ProfessorDashboard and ProfessorClassDashboard style dependencies.

Files:
- apps/web/src/pages/ProfessorDashboard.tsx
- apps/web/src/pages/ProfessorClassDashboard.tsx
- apps/web/src/index.css

Acceptance:
- Tables and modal layout keep parity.

Status:
- Completed.

### Phase 4: Student + Archive + Matrix + Upload
Scope:
- Migrate student-facing domain styles.

Files:
- apps/web/src/pages/StudentDashboard.tsx
- apps/web/src/pages/ActivityArchive.tsx
- apps/web/src/pages/SubmissionMatrix.tsx
- apps/web/src/pages/UploadPage.tsx
- apps/web/src/index.css

Status:
- Completed.

### Phase 5: Sandbox + Dock
Scope:
- Migrate sandbox and dock interfaces.

Files:
- apps/web/src/pages/SandboxPage.tsx
- apps/web/src/pages/DockPage.tsx
- apps/web/src/index.css

Status:
- Completed.

### Phase 6: Tailwind and Global CSS Cleanup
Scope:
- Remove Tailwind directives if no longer used.
- Remove final global selectors and style import when safe.

Files:
- apps/web/src/index.css
- apps/web/src/main.tsx
- apps/web/postcss.config.js (if cleanup required)
- apps/web/tailwind.config.cjs (if cleanup required)

Acceptance:
- App runs with Mantine-first styling and no handwritten app CSS files.

Status:
- Completed.

## Execution Checklist (Per Phase)
1. Migrate one selector group to TSX/Mantine styling.
2. Verify parity manually.
3. Remove old selector block from index.css.
4. Run build and diagnostics.
5. Confirm responsive and theme behavior.

## Definition of Done
- App styling is Mantine-first and TSX-driven.
- No page/component CSS files exist.
- Global app CSS is eliminated or reduced to negligible framework-only needs.
- Build passes and visuals remain acceptable.
