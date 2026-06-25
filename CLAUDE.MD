# CLAUDE.MD

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is currently **pre-implementation**. It contains the planning and design
documentation for "Vicentinos", a rugby & hockey club's web platform — no application code
(no `package.json`, no `src/`) exists yet. There are no build/lint/test commands to run.
When implementation starts, this file should be updated with real commands and the actual
source layout.

The full spec lives in `plan/`, written as a series of chat-based design sessions:

- `plan/chat1-modelo-datos.md` — data model: entities, roles, business rules
- `plan/chat2-backend.md` — backend stack, API, auth, payments
- `plan/chat3-integracion.md` — legacy system integration/migration strategy
- `plan/chat4-frontend-arquitectura.md` — frontend architecture, routing, state
- `plan/chat5-frontend-modulos.md` — frontend module breakdown, build order
- `plan/vicentinos-design-system.md` — visual identity, color tokens, typography

`tailwind.config.ts` already encodes the design system's color tokens (see below) ahead of
the actual app scaffold.

## Domain model

Single-club platform serving **socios** (rugby and hockey) plus internal operations staff.
Key concepts that recur across every module:

- **Roles:** Socio, Subcomisión, Comisión Directiva (CD), Empleado, Jefe de área, Administrador.
  Empleados and socios share authentication but never cross business logic — an empleado cannot
  reach the socio portal and vice versa.
- **`solicitud` (request) entity:** a single entity covers both space reservations and
  fundraising activities, distinguished by `origen` (socio / subcomisión) and `tipo` (reserva
  espacio / actividad recaudatoria). Flow: `pendiente → aprobado / rechazado` (with note).
  Every solicitud requires CD approval, no exceptions. Rejected requests can be corrected and
  resubmitted by whoever started them.
- **Operational tasks (`tarea`):** backlog items for empleados, scoped to fixed areas
  (mantenimiento, limpieza, seguridad). Flow: `pendiente → en proceso → con limitante / finalizado`.
  A `limitante` alerts the jefe de área without blocking the task.
- **Carnet digital:** every socio has a digital membership card (name, photo, member number,
  category, membership status, parking eligibility, QR). Parking eligibility is a *derived*
  field — it always reflects current cuota (dues) status, never stored independently. The QR
  encodes a stable per-socio token resolving at the public, unauthenticated route
  `GET /verificar/:token`, which exposes only non-sensitive fields (name, photo, status, parking).

## Backend decisions (planned)

- Stack: Node.js + TypeScript, PostgreSQL (chosen for the relational complexity of
  socios/categorías/solicitudes/cuotas), Supabase for managed Postgres + auth during early
  development, with AWS RDS/DigitalOcean as a later migration target if scale requires it.
- Auth: JWT + refresh tokens, RBAC across the six roles above.
- **No payment gateway for membership dues.** Auto-debit runs through Banco Macro + Prisma via
  manually-uploaded files (COELSA format) — there is no direct debit API. The backend's job is
  to generate the monthly debit file and to parse the bank's rendición (settlement) file back,
  updating cuota state and carnet status automatically. The treasurer's only manual steps are
  uploading/downloading those two files. A separate, future payment gateway is only being
  considered for boutique/activity purchases, never for cuotas.
- **Legacy system:** the club's existing management system is being *replaced*, not integrated.
  Decision was to do a one-time data migration (padrón de socios, categorías, historial de pagos,
  CBU/tarjetas) rather than maintain a live integration, since the new system now owns débito,
  carnet, and member status end-to-end.

## Frontend decisions (planned)

- React + TypeScript, role-based protected routing — each role only sees its own route tree.
- The only fully public, unauthenticated route is the carnet verification view (reached via QR).
- Module build order (see `plan/chat5-frontend-modulos.md`): auth → portal de socios → carnet
  digital → reserva de espacios → actividades recaudatorias → panel CD → portal subcomisión →
  módulo operativo (empleado, then jefe de área) → boutique → panel admin.

## Design system (`tailwind.config.ts`, `plan/vicentinos-design-system.md`)

- Mobile-first (375px baseline), institutional-but-modern tone: thin borders (0.5px), no
  decorative shadows/gradients.
- Color tokens: `navy` (50/200/400/600/800/950, primary = `navy-800`) for institutional blue,
  `gold` (50/300/500/700, primary = `gold-500`) for the secondary/CTA color, `neutral` for grays,
  and semantic `success`/`danger`/`warning`/`info` each with `DEFAULT`/`light`/`border`/`text`
  variants for banners/chips. Treat these tokens, not raw hex values, as the source of truth —
  they mirror the club crest's navy/gold palette.
- Typography: Inter, sizes/weights defined per role (H1 32/700, H2 22/600, H3 17/600, Body
  15/400, Body small 13/400, Label UI 12/500 uppercase, Caption 12/400). Never use weights
  outside 400–700; uppercase labels are always 12px/500, never larger.

## Working conventions in this repo

- Default to plan mode for anything non-trivial (3+ steps or an architectural decision); if an
  approach goes sideways mid-task, stop and re-plan rather than pushing through.
- Offload research/exploration/parallel analysis to subagents to keep the main context clean —
  one focused subagent per task.
- After any user correction, record the pattern as a lesson so the same mistake isn't repeated.
- Never mark a task done without proof (tests run, behavior demonstrated, diffed against main
  where relevant).
- For bug reports: reproduce with a test first, then fix against that failing test — don't
  guess-patch.

## Other repo content

- `.agents/skills/` — a set of imported design/"taste" skills (brandkit, minimalist-ui,
  industrial-brutalist-ui, image-to-code, etc.) sourced from `Leonxlnx/taste-skill` via
  `skills-lock.json`. Relevant when doing visual/UI design work.
- `.beads/` — an issue-tracking data store (currently empty); not yet in active use.
