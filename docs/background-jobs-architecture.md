# Background Jobs & Workflow Architecture

This document defines Fulcra's background execution and asynchronous workflow architecture.

---

## 1. Why Trigger.dev?

Fulcra adopts **Trigger.dev** as its dedicated background execution and workflow runtime.

### Architectural Principles

1. **Serverless-First**: Background tasks execute as stateless, on-demand compute units managed by Trigger.dev rather than long-running, always-on worker processes.
2. **No Persistent Queue Infrastructure**: Fulcra does not maintain, host, or operate persistent worker VMs, Redis instances, BullMQ workers, RabbitMQ clusters, Kafka brokers, or Temporal workers.
3. **Resilience by Default**: Transient external network glitches, third-party provider timeouts, and rate limits are managed through native exponential backoff and jitter rather than ad-hoc retry loops.
4. **Execution Decoupled from Ingestion**: Synchronous user requests and API transactions must never block on slow, multi-step, or externally dependent operations.

---

## 2. Monorepo Responsibilities

Fulcra enforces strict separation of concerns across its workspaces:

```text
               ┌──────────────┐
               │   apps/web   │  Presentation & User Interaction
               └──────┬───────┘  (Next.js App Router, shadcn/Base UI)
                      │
                      ▼
               ┌──────────────┐
               │   apps/api   │  Synchronous Orchestration & Validation
               └──────┬───────┘  (Hono, Zod, Route Handlers, /api/v1)
                      │
            dispatch / schedule
                      │
                      ▼
               ┌──────────────┐
               │ apps/trigger │  Asynchronous Tasks & Workflows
               └──────┬───────┘  (Trigger.dev runtime, retries, schedules)
                      │
     ┌────────────────┼────────────────┐
     ▼                ▼                ▼
  Neon DB       External APIs     Future AI &
(PostgreSQL)    (ATS / Jobs)     Browser Engines
```

| Layer        | Workspace      | Primary Responsibilities                                                                      | Anti-Patterns (Forbidden)                                                   |
| ------------ | -------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Web**      | `apps/web`     | UI rendering, client state, forms, user interactions.                                         | Direct database queries, background job triggering.                         |
| **API**      | `apps/api`     | Fast request/response orchestration, authentication, validation, error mapping, job dispatch. | Long-running operations (>2s), in-process background loops, cron intervals. |
| **Trigger**  | `apps/trigger` | Async tasks, multi-step workflows, scheduled operations, retryable external integrations.     | HTTP server endpoints, direct UI logic, stateful in-memory processes.       |
| **Database** | Shared (Neon)  | Persistent source of truth, transactional state, relational constraints.                      | Running persistent workers inside DB triggers.                              |

---

## 3. Directory Layout (`apps/trigger`)

```text
apps/trigger/
├── src/
│   ├── config/
│   │   ├── env.ts                        # Zod-validated environment config
│   │   └── index.ts
│   │
│   ├── services/                         # Deterministic business logic
│   │   └── system/
│   │       ├── health-check.service.ts   # Core service logic (pure TS)
│   │       └── index.ts
│   │
│   ├── tasks/                            # Trigger.dev task adapters
│   │   └── system/
│   │       ├── health-check.task.ts      # Task adapter with native retries
│   │       ├── maintenance-ping.task.ts  # Scheduled cron task
│   │       └── index.ts
│   │
│   ├── shared/
│   │   ├── errors/                       # TaskError hierarchy & retry classification
│   │   │   ├── task-error.ts
│   │   │   └── index.ts
│   │   │
│   │   └── logging/                      # Structured logger with redaction
│   │       ├── logger.ts
│   │       └── index.ts
│   │
│   └── index.ts                          # Public exports
│
├── test/                                 # Vitest hermetic test suites
│   ├── services/
│   │   └── health-check.service.test.ts
│   ├── tasks/
│   │   └── health-check.task.test.ts
│   └── shared/
│       └── errors.test.ts
│
├── trigger.config.ts                     # Trigger.dev v3 configuration
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

---

## 4. Tasks vs. Workflows

Fulcra distinguishes between single execution units (**Tasks**) and multi-step coordinated sequences (**Workflows**):

### Task (Atomic Unit)

A single, deterministic, retryable operation with typed input and output.

- Examples (future): `candidate.parse`, `job.fetch`, `embedding.generate`, `ats.analyze`.

### Workflow (Coordinated Orchestration)

A sequence or directed graph of tasks with conditional branching, error recovery, and intermediate state management.

- Example (future):
  ```text
  resume-processing-workflow
      ├── 1. document.extract
      ├── 2. resume.parse
      ├── 3. profile.normalize
      ├── 4. embedding.generate
      └── 5. profile.persist
  ```

---

## 5. Separation of Task Adapter and Business Logic

Tasks must **never** embed large blocks of inline domain logic. Instead, the task acts solely as an execution adapter:

```text
Trigger.dev Task Adapter (e.g. src/tasks/system/health-check.task.ts)
    │ Validates payload via Zod
    │ Configures retry policies & concurrency limits
    ▼
Domain Service (e.g. src/services/system/health-check.service.ts)
    │ Pure deterministic TypeScript
    │ Zero Trigger SDK runtime dependencies
    │ Unit-tested independently in Vitest
    ▼
Database / External Integration Adapter
```

Benefits:

1. Business logic remains 100% testable in hermetic Vitest suites without spinning up Trigger runtimes.
2. The same domain capability can be triggered via API, background task, CLI, or MCP without duplicate code.

---

## 6. Retries & Error Classification

Never implement custom retry loops (`while`, `setTimeout`). Trigger.dev provides native retries with exponential backoff and jitter.

### Error Classification Hierarchy

| Error Class           | Code                    | Retryable? | Usage                                                                 |
| --------------------- | ----------------------- | ---------- | --------------------------------------------------------------------- |
| `TaskValidationError` | `TASK_VALIDATION_ERROR` | **No**     | Malformed input, missing required fields.                             |
| `TaskDomainError`     | `TASK_DOMAIN_ERROR`     | **No**     | Invariant violation, entity not found, non-recoverable business rule. |
| `TaskTransientError`  | `TASK_TRANSIENT_ERROR`  | **Yes**    | 503 upstream, rate limit, transient socket timeout.                   |
| `TaskInternalError`   | `TASK_INTERNAL_ERROR`   | **No**     | Unhandled bug or fatal runtime crash.                                 |

### Retry Configuration Pattern

```typescript
export const exampleTask = task({
  id: "example.task",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
    randomize: true, // adds jitter
  },
  run: async (payload) => {
    // ...
  },
})
```

---

## 7. Idempotency

Background tasks may be retried automatically upon network glitches or server resets. Therefore:

> **All triggered background operations must either be inherently idempotent or enforce an explicit idempotency key.**

### Idempotency Key Format

```text
<domain>:<entityId>:<action>:<versionOrTimestamp>
```

_Example:_ `resume:usr_123:parse:v1` or `job:sync:greenhouse:2026-09-10`

Trigger.dev accepts an `idempotencyKey` parameter when invoking tasks:

```typescript
await tasks.trigger("resume.process", payload, {
  idempotencyKey: `resume:${candidateId}:process:${uploadId}`,
})
```

---

## 8. Concurrency & Rate Limiting

Trigger.dev natively supports concurrency controls per task or per tenant.

### Patterns

1. **Global Task Concurrency**: Limit concurrent scraping or external API requests to prevent upstream IP blocks.
2. **Keyed Concurrency**: Limit concurrency per user or candidate (e.g., `concurrencyKey: payload.userId`) so one user running batch workflows cannot starve platform resources for other users.

---

## 9. Scheduling (Cron)

Scheduled work must not rely on operating system cron jobs or persistent timers. Trigger.dev provides serverless scheduled tasks via `schedules.task`:

```typescript
export const maintenancePingTask = schedules.task({
  id: "system.maintenance-ping",
  cron: "0 0 * * *", // Daily UTC midnight
  run: async () => {
    // ...
  },
})
```

---

## 10. API → Trigger Boundary

The API dispatches background work via `TriggerDispatcher` in `apps/api/src/infrastructure/trigger/dispatcher.ts`:

- **Decoupled**: API routes call `triggerDispatcher.dispatch("task.id", payload, options)` rather than interacting directly with raw SDK functions.
- **Offline / CI Resilient**: In offline environments or hermetic tests where `TRIGGER_SECRET_KEY` is not present, `TriggerDispatcher` logs an informational trace and returns `{ success: true, mode: "dry-run" }` without throwing errors.

---

## 11. Structured Logging & Secret Sanitization

Background tasks use `taskLogger` in `apps/trigger/src/shared/logging/logger.ts`:

- Standard context: `taskId`, `runId`, `durationMs`, `status`, `errorCode`.
- Automatic redaction: Passwords, tokens, database connection strings, Trigger API keys, and sensitive user data are automatically replaced with `[REDACTED]`.

---

## 12. Testing Policy

All background tests are managed under **Vitest**:

1. **Service Tests** (`test/services/*.test.ts`): Verify deterministic domain logic, input processing, and error classifications.
2. **Task Adapter Tests** (`test/tasks/*.test.ts`): Verify task IDs, invoker methods, and schema validation.
3. **Dispatcher Tests** (`apps/api/test/trigger/*.test.ts`): Verify API dispatch boundaries and offline resilience.
4. **Hermetic CI**: All tests pass without requiring active Trigger.dev cloud credentials or network access.

---

## 13. Developer Commands

```bash
# Start Trigger.dev local development environment
pnpm --filter trigger dev

# Run Vitest test suite
pnpm --filter trigger test

# Type-check Trigger codebase
pnpm --filter trigger check-types

# Lint Trigger codebase
pnpm --filter trigger lint

# Build production bundle with tsup
pnpm --filter trigger build
```
