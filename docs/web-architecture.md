# Fulcra Web Architecture & Product Shell

This document defines the frontend architecture, product routing, public discovery foundation, and navigation patterns for Fulcra (`apps/web`).

---

## 1. Single-Domain Product Architecture

Fulcra lives entirely on **one domain**:

```text
https://fulcra.com
```

There is **no separate marketing website**. The landing page (`/`) serves as the front door of the product, and authenticated surfaces live directly on the same domain:

| Route           | Access Level        | Description                                                      |
| --------------- | ------------------- | ---------------------------------------------------------------- |
| `/`             | Public              | Reconstructed product landing page with interactive fulcrum      |
| `/jobs`         | Public              | Public job discovery directory with filtering & search           |
| `/jobs/[jobId]` | Public              | Public job details with source attribution & auth gate           |
| `/candidate`    | Authenticated (Dev) | Canonical candidate profile, experience, skills, and preferences |
| `/discover`     | Future (Phase 9)    | Authenticated job discovery & matching surface                   |
| `/matches`      | Future (Phase 9)    | Explainable match scoring and rank ordering                      |
| `/resumes`      | Future (Phase 10)   | Evidence-linked resume tailoring & diff generator                |
| `/applications` | Future (Phase 11)   | Application tracker, lifecycle states, and communications        |

---

## 2. API Host & Same-Origin Proxy

Browser-facing application code communicates via relative same-origin paths (`/api/v1/*`) rather than hardcoding external origins.

Next.js (`apps/web/next.config.ts`) establishes an internal rewrite proxy:

```text
Browser
  ↓
fulcra.com/api/v1/... (Same Origin)
  ↓ [Next.js Rewrites Proxy]
apps/api (:4000) /api/v1/...
```

The typed client (`apps/web/lib/api-client.ts`) automatically uses relative requests in the browser (`typeof window !== "undefined"`), while falling back to `INTERNAL_API_URL` during server-side rendering.

---

## 3. Product Shell & Navigation

Navigation is split into two explicit shells:

### Public Shell

Used by `/`, `/jobs`, and `/jobs/[jobId]`:

- **`PublicHeader`** (`components/fulcra/navigation/public-header.tsx`): Fulcra brand mark, anchor links (`#loop`, `#matching`, `#modes`), `Explore jobs` link, `Log in` action, and mobile responsive drawer.
- **`PublicFooter`** (`components/fulcra/navigation/public-footer.tsx`): Product links, candidate links, ATS diagnostic legal disclaimer, and version indicator.
- **`FulcraCursor`** (`components/fulcra/shared/fulcra-cursor.tsx`): Precision dot & ring cursor with smooth mouse damping, hover element scale-up, touch suppression, and `prefers-reduced-motion` compliance.

### Application Shell

Used by authenticated product surfaces (e.g. `/candidate`):

- **`AppHeader`** (`components/fulcra/navigation/app-header.tsx`): Main product tabs (`Discover`, `Candidate`, `Matches`, `Resumes`, `Applications`), development principal indicator (`dev-candidate-user`), and return link to public site.
- **`AppShell`** (`components/fulcra/navigation/app-shell.tsx`): Page wrapper providing layout structure, standard padding, and responsive mobile navigation.

---

## 4. Public Job Discovery Architecture

Because the Job backend domain is scheduled for a future phase, the web product establishes a **typed frontend adapter boundary**:

```text
UI Layer (app/jobs/page.tsx, components/fulcra/jobs/*)
  ↓
Typed Adapter (lib/jobs/jobs-client.ts)
  ↓
Fixtures / Future API (lib/jobs/jobs-fixtures.ts → /api/v1/jobs)
```

- **`JobSearchResult`**: Paginated result containing normalized `Job` entities.
- **`JobFilters`**: Query string, `workType` (remote/hybrid/on-site), `seniority`, `source` (Lever/Greenhouse/Workday/Direct), and sorting (`recent`/`salary`/`title`).
- **`JobCard`**: Displays title, company, work type, seniority, compensation range, source tag, skills, and mock match state (`Match unavailable — Sign in to see your score`).
- **`JobDetailView`**: Comprehensive view including responsibilities, requirements, benefits, and source attribution notice.

---

## 5. Auth-Gated Action Pattern

Authentication is not yet integrated with a live identity provider. To prepare for future authentication without faking mock credentials, Fulcra implements an **Auth-Gate pattern**:

- **`AuthGateDialog`** (`components/fulcra/auth/auth-gate-dialog.tsx`):
  Triggered when an unauthenticated user attempts state-changing or personalized actions:
  - "Weigh match"
  - "See how I match"
  - "Save role"
  - "Log in"
- Clearly articulates the value proposition (evidence-linked matching, resume tailoring, application tracking) and links to the Candidate surface in development mode.

---

## 6. Landing Page Reconstruction

Reconstructed from `refrence.html` and visual screenshots natively within the Fulcra Paper/Ink/Indigo/Brass design system:

1. **`HeroSection`**: Pulsing green status dot (`Live scoring, not a checklist`), Space Grotesk headline, evidence matching copy, and primary CTAs.
2. **`InteractiveFulcrum`**: Canvas-rendered 3D balance beam with dark triangular fulcrum base, candidate evidence sphere (brass), role requirements sphere (indigo), mouse parallax tilt, animated `94%` match counter, and diagnostic score bars.
3. **`SixStepLoop`**: Dynamic scroll-based progress rail with 6 product loop steps (`01 Discover`, `02 Understand`, `03 Match`, `04 Optimize`, `05 Apply`, `06 Track`).
4. **`MatchAnalysisSection`**: Explainable breakdown of Skills, Experience, Seniority, Domain, and Compensation.
5. **`ResumeTailoringSection`**: Evidence-linked diff showing removed generic statements and added verified accomplishments.
6. **`ApplicationTrackingSection`**: Timeline tracking application submission, ATS viewing, and interview progression.
7. **`ModesSection`**: Segmented role toggle between Candidate (Brass) and Recruiter (Indigo) workflows.
8. **`CtaBand`**: Dark ink band with indigo ambient glow and primary exploration CTA.

---

## 7. 250-Line Source File Rule

All frontend source files (`.ts`, `.tsx`) strictly adhere to the **<= 250 lines of code** standard. Components are separated by single responsibility:

- Hooks extract stateful workflows (`useCandidateProfile`).
- Primitives are composed from `components/ui/`.
- Page files orchestrate components rather than declaring inline business logic.
