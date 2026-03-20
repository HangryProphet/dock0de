# Dock0de UI/UX Guide

## Core Design Principles
- Modern, minimal, and calm. Prioritize clarity over decoration.
- Bento-box grid layouts with consistent spacing and alignment.
- Flat surfaces with subtle 1px borders; avoid heavy shadows.
- High contrast text on crisp surfaces; only one accent color.
- Generous rounding on cards, inputs, and buttons.
- No gradient backgrounds, no gradient text, no glow effects.

## Color Palette
Base (Light)
- Background: #F7F7F5
- Surface (Card): #FFFFFF
- Surface Alt: #F2F2EE
- Border: #E5E5E0
- Text Primary: #111111
- Text Secondary: #5E5E5E
- Text Muted: #8A8A8A
- Accent: #2E3A8C (deep indigo)
- Accent Hover: #253170
- Accent Subtle: #E9ECFB

Optional Dark Mode (Navy/Slate)
- Background: #0F141B
- Surface (Card): #151B23
- Surface Alt: #1A212B
- Border: #2A3442
- Text Primary: #F2F5F9
- Text Secondary: #B7C1CF
- Text Muted: #8A97A8
- Accent: #6E7CFF
- Accent Hover: #5E6DE6
- Accent Subtle: #1B2140

## Typography System
- Primary Font: Manrope (modern, clean, non-default sans-serif)
- Fallbacks: "Manrope", "Sora", "Noto Sans", "Segoe UI", sans-serif

Type Scale (Desktop)
- Display / KPI: 32px, 700, -0.02em
- H1: 24px, 700, -0.01em
- H2: 20px, 600, -0.01em
- H3: 16px, 600, 0
- Body: 14px, 500, 0
- Small: 12px, 500, 0
- Micro: 11px, 500, 0.01em

Type Scale (Mobile)
- Display / KPI: 28px
- H1: 22px
- H2: 18px
- H3: 15px
- Body: 14px
- Small: 12px

## Layout Structure
Dashboard
- 12-column grid, 24px gutters, 24px page padding.
- Bento layout: mix 1x1, 2x1, and 2x2 cards for visual rhythm.
- Top header: 64px height, contains search, breadcrumbs, profile menu.
- Sidebar: 240px width, collapsible to 72px.

Sidebar (Role-Based Navigation)
- Professor: Accordion list with Year Level -> Section only (no activities).
- Student: Flat "My Classes" list with year/section in the label.
- Remove global Upload links; use contextual actions inside pages.

Horizontal Tabs (Teams-Style)
- Height: 48px, full-width.
- 1px bottom border (#E5E5E0).
- Active tab uses Accent text + 2px Accent underline.
- Tab labels: 14px, 600 weight.

Main Content
- KPI row of 3-4 cards.
- Activity and runs table in a wide card.
- Right rail (optional) for quick actions and status.

Submission Matrix (Activity Archive)
- Grid layout: rows = students, columns = activity tasks or runs.
- Each cell is a 24-32px rounded square with 1px border.
- Status color uses muted fills (Success, Warning, Error) with 70% opacity.
- Tooltip on hover for run details (timestamp, health score).

Dock Layout (Live Preview Workspace)
- Split pane: 60/40 horizontal on desktop, stacked on mobile.
- Logs pane uses a monospaced terminal card:
  - Background: #151B23
  - Text: #F2F5F9
  - Radius: 12px
  - Padding: 16px
- Preview pane uses an iFrame container:
  - 1px border, 14px radius
  - 360-520px height based on viewport
- Floating grading action bar pinned to bottom with 1px border and Surface background.

Sandbox (Professor Quick Access)
- Quick Test dropzone above a lightweight table.
- Keep layout compact to reduce friction.

## Component Rules
Cards
- Background: Surface, border 1px solid Border.
- Radius: 14px.
- Padding: 20px (desktop), 16px (mobile).
- No shadows or glow.

Buttons
- Primary: Accent background, white text, 12px radius.
- Secondary: Surface with 1px border and Text Primary.
- Ghost: transparent, Text Secondary, hover uses Surface Alt.
- Height: 36px, font 14px, weight 600.

Inputs
- Background: Surface, border 1px solid Border.
- Radius: 12px, height 36px.
- Focus: border Accent, subtle inner outline.
- Placeholder: Text Muted.

Badges
- Radius: 999px.
- Default: Surface Alt with Text Secondary.
- Success: #EAF7EF text #1B6A3A.
- Warning: #FFF4E5 text #8A5A00.
- Error: #FDECEC text #9B1C1C.

## Spacing & Grid
- Base unit: 4px.
- Common gaps: 8, 12, 16, 24, 32.
- Card grid gap: 16-20px.

## Motion
- Use light transitions only: 120-180ms ease-out.
- Limit to opacity and transform (2-4px translate).
- No looping or glowing animations.

## Iconography
- Simple line icons (1.5px stroke).
- Use consistent size: 18-20px.

## Implementation Notes (Mantine + Tailwind)
- Use CSS variables for palette to keep theme consistent.
- Keep components flat; remove default shadows.
- Enforce consistent radius and border tokens.
