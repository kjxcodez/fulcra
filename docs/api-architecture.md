# Fulcra API Architecture & Governance Rules

This document outlines the architectural boundaries and governance rules for developing and scaling the Fulcra API (`apps/api`). All future contributors and agentic workflows must adhere strictly to these principles.

---

## 1. Feature-Based Modular Organization

The API is organized by **business capability/domain features**, not by technical layers:

```text
src/features/
├── health/
├── version/
└── [future_feature]/
    ├── [feature].route.ts
    ├── [feature].schema.ts
    ├── [feature].service.ts    (optional, only if domain logic warrants it)
    └── index.ts                (public interface for the feature)
```

### Feature Ownership Rules

1. **Co-location**: Keep all route handlers, schemas, validation rules, types, and internal feature logic inside that feature's directory (`src/features/<feature>/`).
2. **Minimal Abstractions**: Do not blindly create service/repository/controller files if a simple route handler suffices. Introduce internal layers only when complexity justifies them.
3. **Public Interface**: Each feature must expose an `index.ts` file that acts as its public API (typically exporting its route router and public types).

---

## 2. Shared Infrastructure Boundaries

Cross-cutting concerns must reside outside feature modules:

| Directory             | Purpose                                                       | Allowed Dependencies                  |
| --------------------- | ------------------------------------------------------------- | ------------------------------------- |
| `src/config/`         | Environment variables, validated with Zod                     | Node / external config libraries only |
| `src/infrastructure/` | Low-level technical adapters (logging, future cache/database) | Config, external drivers              |
| `src/middleware/`     | Global HTTP pipeline (request ID, logging, CORS, errors)      | Config, infrastructure, shared        |
| `src/shared/`         | Shared contracts, response helpers, AppError, shared types    | Config, standard libraries            |

---

## 3. Dependency Direction Rules

To prevent spaghetti dependencies and circular imports:

```text
┌─────────────────────────┐
│     Feature Modules     │  (e.g., health, version, candidates, jobs)
└───────────┬─────────────┘
            │  imports from (ALLOWED)
            ▼
┌─────────────────────────┐
│  Shared Infrastructure  │  (shared/, middleware/, config/, infrastructure/)
└─────────────────────────┘
```

- **Rule 1**: Feature modules may import from `shared/`, `middleware/`, `config/`, and `infrastructure/`.
- **Rule 2**: `shared/`, `middleware/`, `config/`, and `infrastructure/` **MUST NEVER** import from any feature module.
- **Rule 3**: Features must not reach into the private implementation files of another feature. If feature A needs something from feature B, feature B must explicitly export it from its `index.ts`.
- **Rule 4**: Avoid circular dependencies.

---

## 4. API Versioning

All public API endpoints are versioned under `/api/v1/`:

- Routes for v1 are registered in [`src/app/routes.ts`](file:///c:/Users/91637/Desktop/Business%20Project/fulcra/apps/api/src/app/routes.ts).
- When a future major breaking change requires `/api/v2/`:
  - Create a new router `src/app/v2-routes.ts` or mount `v2Router` in [`src/app/router.ts`](file:///c:/Users/91637/Desktop/Business%20Project/fulcra/apps/api/src/app/router.ts).
  - Do NOT rewrite or break v1 routes.

---

## 5. Serverless-First & Stateless Execution

The API is designed for serverless/edge environments:

1. **No Global Mutable State**: Never store state in module-level variables or in-memory arrays across requests.
2. **No Local Filesystem Assumptions**: Do not write files to local disk expecting them to persist across invocations.
3. **No Process-Specific Sessions**: Session and authentication tokens must be stateless (e.g. signed JWTs) or stored in external distributed storage (e.g. Redis).
4. **Decoupled Application Object**: Central app creation in `src/app/app.ts` is decoupled from the Node HTTP server in `src/index.ts`. Any serverless entrypoint (e.g. Vercel Serverless Function, Cloudflare Worker) can import `app.fetch` directly without launching a long-running Node process.

---

## 6. Error Handling & Response Contracts

1. **Always Use `AppError`**: Never throw unformatted strings or raw internal errors across the API boundary. Use `AppError` with standard `ERROR_CODES`.
2. **Standard Envelopes**:
   - Success: `{ success: true, data: ..., meta: { requestId, timestamp } }`
   - Error: `{ success: false, error: { code, message, details? }, meta: { requestId, timestamp } }`
3. **No Leaked Stack Traces**: Production responses must never expose stack traces, database query strings, or credentials to clients. The centralized error handler safely catches and logs them internally while returning a sanitized 500 `INTERNAL_ERROR`.

---

## 7. Extension Points

- **Authentication**: When implementing authentication, attach an auth middleware in `src/app/app.ts` after CORS and before route handlers. Bind the authenticated user/session to `c.set("user", user)`.
- **Rate Limiting**: Add rate-limiting middleware in the pipeline after Request ID and before route handlers.
