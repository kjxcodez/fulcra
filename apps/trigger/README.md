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
│   ├── services/                         # Deterministic business logic (pure TS)
│   │   └── system/
│   │       ├── health-check.service.ts   # Core health-check logic
│   │       └── index.ts
│   │
│   ├── tasks/                            # Trigger.dev task adapters
│   │   └── system/
│   │       ├── health-check.task.ts      # system.health-check task adapter
│   │       ├── maintenance-ping.task.ts  # system.maintenance-ping scheduled task
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
│   │   └── health-check.service.test.ts
│   ├── tasks/
│   │   └── health-check.task.test.ts
│   └── shared/
│       └── errors.test.ts
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
2. **Native Retries**: No ad-hoc retry loops. Tasks define exponential backoff and jitter via Trigger.dev's native `retry` policy.
3. **Idempotency by Rule**: Background work must assume duplicate executions can occur; operations must be safe to retry or specify an `idempotencyKey`.
4. **Hermetic Testing**: Unit and task tests run under Vitest with zero dependencies on live Trigger.dev cloud credentials.

---

## Commands

```bash
# Start Trigger.dev local development runtime
pnpm --filter trigger dev

# Run Vitest test suite
pnpm --filter trigger test

# Type-check TypeScript
pnpm --filter trigger check-types

# Lint with ESLint
pnpm --filter trigger lint

# Format with Prettier
pnpm --filter trigger format

# Build bundle with tsup
pnpm --filter trigger build
```
