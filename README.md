# Fulcra

Fulcra is an AI-powered career and hiring platform that connects candidates, jobs, applications, and recruiting workflows through a shared intelligence layer.

It is designed to:

- Discover and aggregate jobs from multiple sources
- Understand and normalize job descriptions
- Build structured candidate profiles
- Match candidates with roles using explainable scoring
- Parse and analyze resumes
- Evaluate ATS compatibility
- Generate and tailor resumes from real candidate evidence
- Generate application materials
- Automate supported application workflows
- Track applications and their complete history
- Provide recruiting, candidate screening, and hiring pipelines
- Expose platform capabilities through MCP and AI agents

Fulcra is being built as a serverless-first TypeScript monorepo with a strong focus on modularity, reliability, security, and low initial infrastructure cost.

## Repository Structure

```text
fulcra/
├── apps/
│   └── web/                 # Main Next.js web application
│
├── packages/
│   ├── eslint-config/       # Shared ESLint configuration
│   └── typescript-config/   # Shared TypeScript configuration
│
├── docs/                    # Product, design, architecture, and engineering documentation
├── scripts/                 # Repository and development utilities
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

Additional applications and domain packages will be introduced as the architecture develops. We intentionally avoid creating packages before a real reuse or architectural boundary exists.

## Technology

The current foundation includes:

- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Turborepo](https://turborepo.dev/)
- [pnpm](https://pnpm.io/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

The broader architecture is designed around managed/serverless infrastructure, with technologies such as PostgreSQL, Upstash, Trigger.dev, Playwright, managed browser infrastructure, AI providers, and MCP being introduced where they provide a clear architectural benefit.

## Prerequisites

- **Node.js**: `>=24.0.0`
- **pnpm**: `11.25.0`

## Development Workflow

Install dependencies from the repository root:

```bash
pnpm install
```

> Note: Installing dependencies automatically initializes the Husky git hooks via the `prepare` script.

Start the development environment:

```bash
pnpm dev
```

Run development for a specific application:

```bash
pnpm --filter web dev
```

## Build

Build all applications and packages:

```bash
pnpm build
```

Build only the web application:

```bash
pnpm --filter web build
```

## Quality & Validation

Run linting across the workspace:

```bash
pnpm lint
```

Run TypeScript type checks across the workspace:

```bash
pnpm check-types
```

Format the repository with Prettier:

```bash
pnpm format
```

Verify formatting without modifying files:

```bash
pnpm format:check
```

## Git Hooks & Commit Convention

- **Pre-commit**: Automatically runs `lint-staged` on staged files (`eslint --fix` for TS/TSX, `prettier --write` for all).
- **Commit Messages**: Enforces [Conventional Commits](https://www.conventionalcommits.org/) (`@commitlint/config-conventional`) via `.husky/commit-msg`. Example: `feat(web): add candidate card primitive`.
- **CI Pipeline**: GitHub Actions (`.github/workflows/ci.yml`) runs formatting, linting, type checks, and production builds on push and pull requests to `main`.

For detailed contribution guidelines, see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Turborepo

Turborepo is used to orchestrate tasks across the monorepo and provide local and remote caching.

Run a task for a specific workspace:

```bash
pnpm exec turbo build --filter=web
```

For more information, see the [Turborepo documentation](https://turborepo.dev/docs).

## Project Documentation

The `docs/` directory contains the project's source-of-truth documentation, including:

- Product requirements
- Design system
- Information architecture
- User flows
- System architecture
- Domain architecture
- Data model
- ATS architecture
- AI architecture
- Connector architecture
- Workflow architecture
- MCP architecture
- Security
- Observability
- QA and testing
- Delivery roadmap

Architectural and design decisions should be reflected in the documentation before they become implementation conventions.

## Architecture Principles

Fulcra follows a few core principles:

1. **Serverless-first** — avoid unnecessary persistent infrastructure during the early stages.
2. **PostgreSQL as the source of truth** — caches, workflows, browsers, and AI providers do not own business state.
3. **Workflow-native background processing** — long-running work must not depend on an HTTP request remaining alive.
4. **Provider abstraction** — AI, browser, storage, and external integrations should remain replaceable.
5. **Connector-based integrations** — external job platforms are adapters rather than part of core business logic.
6. **Modular monolith before microservices** — introduce service boundaries only when a real requirement exists.
7. **Evidence over fabrication** — AI-generated candidate material must remain grounded in user-provided information.
8. **Explainability by default** — scores and recommendations should expose the reasoning behind them.

## License

This project is licensed under the Apache License 2.0. See [`LICENSE`](./LICENSE) for details.
