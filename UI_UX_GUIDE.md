# Dock0de UI/UX Guide

## Core Design Principles
- Modern, minimal, and calm. Prioritize clarity over decoration.
- Bento-box grid layouts with consistent spacing and alignment.
- Flat surfaces with subtle 1px borders; avoid heavy shadows.
- High contrast text on crisp surfaces; only one accent color.
- Generous rounding on cards, inputs, and buttons.
- No heavy gradients or glow effects; allow subtle theme textures in Cyber/Glass.

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
- Body: 15px, 500, 0
- Small: 13px, 500, 0
- Micro: 12px, 500, 0.01em

Type Scale (Mobile)
- Display / KPI: 28px
- H1: 22px
- H2: 18px
- H3: 15px
- Body: 15px
- Small: 13px

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

Theme Selector (User-Selectable Skins)
- Allow users to switch between four UI styles: Default, Cyber, Glass, Command.
- Theme selector lives in the top header and persists per user/device.
- All surfaces, borders, text, badges, buttons, tables, and modals must inherit theme variables.

Theme Profiles (Detailed Specs)

Default (Light Minimal)
- Purpose: clean baseline with calm, light surfaces.
- Background: #F7F7F5.
- Surface: #FFFFFF, Surface Alt: #F2F2EE, Border: #E5E5E0.
- Text: #111111, Secondary: #5E5E5E, Muted: #8A8A8A.
- Accent: #2E3A8C (deep indigo). Accent Subtle: #E9ECFB.
- Terminal: #151B23 background, #F2F5F9 text.

Cyber (Dark/Neon Console)
- Purpose: high-tech, dense, operations-console vibe.
- Background: #0C1117 with subtle grid/scanline texture.
- Surface: #121A24, Surface Alt: #0F1621, Border: #1F2A38.
- Text: #E6F0FF, Secondary: #9BB0C9, Muted: #6F87A5.
- Accent: #35F2C2 (neon green). Use for active nav, tab underline, badges.
- Terminal: #0A0F16 background, #D7F9F1 text.
- Buttons: primary uses Accent with dark text for contrast; outline uses Accent border + text.
- Badges: use Accent for counts and highlight states; warning uses amber #FFC840.
- Tables: headers and rows use Text color; borders stay low-contrast to reduce noise.
- Effects: no glow, but allow 1px accent edge for active items.

Glass (Layered/Blur)
- Purpose: modern, glassy, layered depth without glow.
- Background: #0F141B with soft multi-radial gradients.
- Surface: rgba(255,255,255,0.08) with 16px blur; Surface Alt: rgba(255,255,255,0.04).
- Border: rgba(255,255,255,0.16).
- Text: #F2F5F9, Secondary: #B7C1CF, Muted: #8A97A8.
- Accent: #6E7CFF (light blue). Use for active nav, tab underline, badges.
- Terminal: rgba(10,14,20,0.80) background, #E9EDF6 text.
- Buttons: primary uses Accent with dark text for contrast; outline uses Accent border + text.
- Badges: use Accent for counts; warning uses #FFC882; error uses #FF7893.
- Modals: must use blurred surface and inherit theme colors (no white modal).

Command (Analytic Command Center)
- Purpose: data-heavy, engineered, high-legibility.
- Background: #F2F4F8.
- Surface: #FFFFFF, Surface Alt: #EEF1F6, Border: #D7DCE6.
- Text: #0F172A, Secondary: #475569, Muted: #64748B.
- Accent: #1F3B8B (navy). Use for active nav, tab underline, badges.
- Terminal: #0F172A background, #E2E8F0 text.
- Buttons: primary uses Accent with white text; outline uses Accent border + text.
- Badges: use Accent for counts; success uses #EAF7EF text #1B6A3A.
- Tables: stronger header contrast and consistent 1px borders for readability.

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
- Columnar table layout with headers: Student, Score, Date Submitted, Environment, Status.
- Status pill text uses labels: GRADED, PENDING REVIEW, NO SUBMISSION.
- Status colors use muted fills from Success/Warning/Error theme tokens.

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

Branding / Logo (Landing Page)
- "DOCK0DE" logo badge rendered as text, enclosed in a rounded glass pill (radius: 999px) with translucent borders (e.g. `rgba(255, 255, 255, 0.15)`).
- Heavy font weight (900) to ensure emphasis without relying on flashy gradients.

Cards
- Background: Surface, border 1px solid Border.
- Radius: 14px.
- Padding: 20px (desktop), 16px (mobile).
- No shadows or glow.

Buttons
- Primary: Accent background, white text, 12px radius.
- Secondary: Surface with 1px border and Text Primary.
- Ghost: transparent, Text Secondary, hover uses Surface Alt.
- Height: Controlled by Mantine sizing props (e.g., `size="sm"` or `size="xs"` for inline table buttons) avoiding wide unconstrained default configurations. Height around 36px, font 14px, weight 600.

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

## Implementation Notes (Strict Mantine + Inline TSX Styles)
- Tailwind CSS has been fully removed. No global utility classes should be used.
- Responsiveness is handled via Mantine's `useMediaQuery` hook alongside inline `React.CSSProperties` objects.
- Action buttons inside CSS Grids are wrapped in `<div>` blocks to prevent standard grid auto-stretching.
- Landing page branding explicitly utilizes `padding`, `border-radius: 999px`, and `background: rgba()` for dynamic glass badges. 
- Keep components flat; remove default shadows.
- Enforce consistent radius and border tokens via Mantine props (`radius="lg"`, etc.).
- Use standard CSS variables (`var(--surface)`, `var(--text)`) to maintain theme consistencies.
