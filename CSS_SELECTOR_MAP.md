# Dock0de Selector to Component Map

## Purpose
Track which selector groups in apps/web/src/index.css belong to each page/component so migration can proceed safely and reversibly.

## Global Foundations
- Theme variables and color tokens: :root, body[data-theme=*]
- Mantine global overrides: .mantine-* selectors
- Responsive breakpoints: @media blocks near bottom of file

## Landing Domain
- Component: apps/web/src/pages/LandingPage.tsx
- Component helper: apps/web/src/components/LetterGlitch.tsx
- Migration status:
  - Phase 1 completed
  - styles migrated to TSX style objects
  - landing and letter-glitch selectors removed from apps/web/src/index.css

## Layout and Navigation Domain
- Component: apps/web/src/layouts/AppLayout.tsx
- Component: apps/web/src/components/Sidebar.tsx
- Migration status:
  - Phase 2 completed
  - styles migrated to TSX style objects
  - layout and sidebar selectors removed from apps/web/src/index.css

## Shared Table and Grid Domain
- Used by multiple professor/student pages
- Selector groups:
  - .page-grid
  - .table-*
  - .kpi-card
  - .class-grid, .class-card
  - .timeline*
  - .metric-list

## Professor Dashboard Domain
- Component: apps/web/src/pages/ProfessorDashboard.tsx
- Selector groups:
  - .dashboard-*
  - .summary-*
  - .attention-row
 - Migration status:
   - Phase 3 completed
   - styles migrated to TSX style objects
   - selectors removed from apps/web/src/index.css

## Professor Class Domain
- Component: apps/web/src/pages/ProfessorClassDashboard.tsx
- Selector groups:
  - .class-header
  - .class-tabs
  - .activities-toolbar
  - .activity-actions-cell
  - .create-activity-*
 - Migration status:
   - Phase 3 completed
   - styles migrated to TSX style objects
   - selectors removed from apps/web/src/index.css

## Student Domain
- Component: apps/web/src/pages/StudentDashboard.tsx
- Selector groups:
  - .submit-banner
  - shared .class- and .timeline- groups
 - Migration status:
   - Phase 4 completed
   - styles migrated to TSX style objects
   - selectors removed from apps/web/src/index.css

## Sandbox Domain
- Component: apps/web/src/pages/SandboxPage.tsx
- Selector groups:
  - .sandbox-page
  - .quick-test
  - .quick-test-controls
 - Migration status:
   - Phase 5 completed
   - styles migrated to TSX style objects
   - selectors removed from apps/web/src/index.css

## Dock Domain
- Component: apps/web/src/pages/DockPage.tsx
- Selector groups:
  - .dock-*
  - .terminal
  - .preview-frame
  - .action-*
  - .score-input
 - Migration status:
   - Phase 5 completed
   - styles migrated to TSX style objects
   - selectors removed from apps/web/src/index.css

## Submission Matrix Domain
- Component: apps/web/src/pages/SubmissionMatrix.tsx
- Selector groups:
  - .matrix*
 - Migration status:
   - Phase 4 completed
   - styles migrated to TSX style objects
   - selectors removed from apps/web/src/index.css

## Upload Domain
- Component: apps/web/src/pages/UploadPage.tsx
- Selector groups:
  - .upload-*
  - .dropzone*
 - Migration status:
   - Phase 4 completed
   - styles migrated to TSX style objects
   - selectors removed from apps/web/src/index.css

## Auth Domain
- Component: apps/web/src/pages/AuthPage.tsx
- Previous selectors removed in migration slice 1:
  - .auth-shell
  - .auth-card
  - .auth-links
- Current status:
  - Migrated to Mantine component-level layout (Center, Card, Group)

## Notes for Migration Execution
- Migrate one domain at a time.
- Remove selectors only after replacement and visual parity check.
- Keep this map updated after each slice.
