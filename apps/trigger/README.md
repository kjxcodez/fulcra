# apps/trigger — Fulcra Background Execution & Workflows

Managed background task and workflow application for Fulcra, built on **Trigger.dev v3/v4**.

---

## Overview

`apps/trigger` executes slow, retryable, scheduled, and externally dependent background operations without blocking the synchronous API or maintaining persistent worker servers.

---

## Directory Structure

```text
apps/trigger/
├── src/
│   ├── config/
│   │   ├── env.ts                        # Zod environment configuration
│   │   └── index.ts
│   │
│   ├── infrastructure/
│   │   └── browser/                      # Provider-independent browser automation
│   │       ├── browser-types.ts          # BrowserSession, BrowserProvider interfaces
│   │       ├── browser-errors.ts         # BrowserError & error mapping
│   │       ├── browser-safety.ts         # Navigation protocol & URL sanitization
│   │       ├── browser-session.ts        # PlaywrightSession implementation
│   │       ├── browser-provider.ts       # Browser provider factory
│   │       ├── lifecycle.ts              # withBrowserSession deterministic cleanup
│   │       ├── providers/
│   │       │   ├── remote-provider.ts    # Managed remote browser (chromium.connect)
│   │       │   ├── local-provider.ts     # Local Chromium launcher
│   │       │   └── mock-provider.ts      # Hermetic in-memory mock
│   │       └── index.ts
│   │
│   ├── services/                         # Deterministic business logic (pure TS)
│   │   └── system/
│   │       ├── health-check.service.ts   # Core health-check logic
│   │       ├── browser-smoke.service.ts  # Browser smoke verification logic
│   │       └── index.ts
│   │
│   ├── tasks/                            # Trigger.dev task adapters
│   │   └── system/
│   │       ├── health-check.task.ts      # system.health-check task adapter
│   │       ├── maintenance-ping.task.ts  # system.maintenance-ping scheduled task
│   │       ├── browser-smoke.task.ts     # system.browser-smoke-test task adapter
│   │       └── index.ts
│   │
│   ├── shared/
│   │   ├── errors/                       # TaskError hierarchy & retry classification
│   │   │   ├── task-error.ts
│   │   │   └── index.ts
│   │   │
│   │   └── logging/                      # Redacted structured logger
│   │       ├── logger.ts
│   │       └── index.ts
│   │
│   └── index.ts                          # Public exports
│
├── test/                                 # Vitest test suites
│   ├── services/
│   │   ├── health-check.service.test.ts
│   │   └── browser-smoke.service.test.ts
│   ├── tasks/
│   │   └── health-check.task.test.ts
│   ├── shared/
│   │   └── errors.test.ts
│   └── browser/
│       ├── errors.test.ts
│       ├── safety.test.ts
│       ├── lifecycle.test.ts
│       ├── mock-provider.test.ts
│       └── integration.test.ts
│
├── trigger.config.ts                     # Trigger.dev configuration
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

---

## Core Principles

1. **Separation of Task and Service**: Trigger task definitions act strictly as execution adapters. Core logic resides in `src/services/` and is fully testable in isolation.
2. **Provider-Agnostic Browser Automation**: Domain code never imports Playwright directly. All browser automation is expressed through `BrowserSession` and `BrowserProvider`. Fulcra currently provides a generic remote browser adapter (`RemoteBrowserProvider`) capable of connecting to managed CDP/WebSocket browser infrastructure; the production provider has not yet been selected.
3. **Internal Infrastructure Boundary**: Browser tasks such as `system.browser-smoke-test` are internal Trigger.dev verification tasks only and are NOT public API capabilities. Arbitrary browser execution is never exposed through public HTTP endpoints.
4. **Deterministic Lifecycle**: `withBrowserSession` guarantees browser contexts and pages are closed cleanly in `finally`, avoiding leaked processes or orphan sessions.
5. **Native Retries**: No ad-hoc retry loops. Tasks define exponential backoff and jitter via Trigger.dev's native `retry` policy.
6. **Idempotency by Rule**: Background work must assume duplicate executions can occur; operations must be safe to retry or specify an `idempotencyKey`.
7. **Hermetic Testing**: Unit and task tests run under Vitest with zero dependencies on live Trigger.dev cloud credentials or external browser services.

---

## Commands

```bash
# Start Trigger.dev local development runtime
pnpm --filter trigger dev

# Run Vitest test suite (all hermetic tests)
pnpm --filter trigger test

# Run live browser integration test (requires BROWSER_PROVIDER_URL in .env.local)
BROWSER_PROVIDER_URL="wss://..." pnpm --filter trigger test test/browser/integration.test.ts

# Type-check TypeScript
pnpm --filter trigger check-types

# Lint with ESLint
pnpm --filter trigger lint

# Format with Prettier
pnpm --filter trigger format

# Build bundle with tsup
pnpm --filter trigger build
```
