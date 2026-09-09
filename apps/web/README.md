# Fulcra Web

The main web application for Fulcra.

Fulcra is an AI-powered career and hiring platform for job discovery, resume intelligence, ATS analysis, application automation, and recruiting workflows.

## Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Base UI](https://base-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/)

## Development

Run the web application from the repository root:

```bash
pnpm --filter web dev
```

Or from this directory:

```bash
pnpm dev
```

The development server will start using the Next.js development environment.

## Components

Fulcra uses shadcn/ui as the foundation for its component system.

Components should be added using the shadcn CLI:

```bash
pnpm dlx shadcn@latest add button
```

Generated primitives live under:

```text
components/ui/
```

These components are then customized to follow the Fulcra design system.

## Design System

The Fulcra design system is defined in the repository documentation.

The implementation should preserve:

- Fulcra semantic color tokens
- Space Grotesk for display typography
- IBM Plex Sans for interface and body text
- IBM Plex Mono for technical/data values
- restrained radius and elevation
- evidence-oriented information hierarchy
- accessibility requirements
- Fulcra motion and interaction rules

Do not introduce independent visual conventions at the component level without updating the design system.

## Component Structure

The web application follows this general structure:

```text
apps/web/
├── app/
├── components/
│   ├── ui/                 # Customized shadcn primitives
│   ├── fulcra/             # Product-specific Fulcra components
│   └── layouts/
│
├── lib/
├── hooks/
├── styles/
└── public/
```

### `components/ui`

Low-level reusable UI primitives such as:

- Button
- Input
- Select
- Dialog
- Dropdown
- Tabs
- Tooltip
- Table
- Command
- Sheet

### `components/fulcra`

Higher-level components specific to Fulcra, such as:

- Match Score
- ATS Score
- Match Breakdown
- Job Card
- Candidate Card
- Resume Preview
- Resume Diff
- Application Timeline
- Pipeline
- Evidence
- AI Actions

## Architecture

The web application is the presentation layer of Fulcra.

Heavy or long-running operations should not be implemented directly inside page requests.

The intended flow is:

```text
Web UI
  ↓
Fulcra API
  ↓
Domain services
  ↓
Database / Background workflows / External integrations
```

The web app should remain focused on:

- Rendering UI
- User interaction
- Form handling
- Lightweight request/response operations
- Authentication/session integration
- Triggering background workflows
- Displaying workflow results and status

## Build

Build the application from the repository root:

```bash
pnpm --filter web build
```

## Lint

```bash
pnpm --filter web lint
```

## Type Check

```bash
pnpm --filter web typecheck
```

## Design Rule

Do not treat shadcn's generated theme as Fulcra's final visual system.

shadcn provides the component foundation. Fulcra owns the tokens, visual hierarchy, interaction behavior, accessibility rules, and product-specific components.
