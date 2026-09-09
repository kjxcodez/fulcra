# Fulcra API (`apps/api`)

Modular, serverless-first, feature-based backend API service for Fulcra, built with [Hono](https://hono.dev), TypeScript, and [Zod](https://zod.dev).

---

## 1. Architectural Philosophy

- **Feature-Based Modularity**: Code is structured around business capabilities (`src/features/<feature>/`) rather than technical layers (`controllers/`, `services/`, `repositories/`).
- **Serverless-First & Stateless**: Application architecture makes zero assumptions about persistent processes, in-memory state, or local filesystem access.
- **Runtime Decoupling**: Central application construction ([`src/app/app.ts`](src/app/app.ts)) is completely independent from the Node.js runtime entrypoint ([`src/index.ts`](src/index.ts)). The app object can be exported directly to serverless adapters (Cloudflare Workers, Vercel Serverless/Edge, AWS Lambda) or tested in-memory with `app.request()`.
- **Predictable Contracts**: All successful responses and errors follow strict, typed JSON envelopes containing machine-readable error codes and request IDs.

---

## 2. Directory Architecture

```text
apps/api/
├── src/
│   ├── app/
│   │   ├── app.ts            # Hono application factory & middleware pipeline
│   │   ├── router.ts         # Top-level API router (/api/v1, future /api/v2)
│   │   └── routes.ts         # v1 feature route registration
│   │
│   ├── config/
│   │   ├── env.ts            # Zod-validated environment configuration
│   │   └── index.ts
│   │
│   ├── infrastructure/
│   │   ├── database/         # Neon PostgreSQL + Drizzle ORM client & schema
│   │   │   ├── client.ts
│   │   │   ├── migrate.ts
│   │   │   ├── schema/
│   │   │   │   ├── users.ts
│   │   │   │   ├── candidate-profiles.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   └── logger/           # Structured logging boundary with sanitization
│   │       ├── logger.ts
│   │       └── index.ts
│   │
│   ├── middleware/
│   │   ├── cors.ts           # Centralized configuration-driven CORS
│   │   ├── error-handler.ts  # Centralized error handler (AppError, Zod, 500)
│   │   ├── not-found.ts      # Standardized 404 handler
│   │   ├── request-id.ts     # X-Request-ID extraction/generation
│   │   ├── request-logger.ts # Request/response duration logger
│   │   └── index.ts
│   │
│   ├── shared/
│   │   ├── errors/           # AppError class & machine-readable error codes
│   │   ├── responses/        # sendSuccess, sendError, sendCollection
│   │   ├── types/            # Context, response envelope, and pagination types
│   │   ├── validation/       # Reusable Zod validator helper
│   │   └── index.ts
│   │
│   ├── features/             # Feature-based domain modules
│   │   ├── health/           # Health / liveness check
│   │   │   ├── health.route.ts
│   │   │   ├── health.schema.ts
│   │   │   └── index.ts
│   │   │
│   │   └── version/          # Version metadata
│   │       ├── version.route.ts
│   │       ├── version.schema.ts
│   │       └── index.ts
│   │
│   └── index.ts              # Local / container runtime entrypoint (Node server)
│
├── test/
│   └── api.test.ts           # In-memory Vitest integration test suite
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

---

## 3. Route Map & Versioning

All public endpoints are versioned under `/api/v1/`:

| Method | Path              | Description                                                                                    |
| ------ | ----------------- | ---------------------------------------------------------------------------------------------- |
| `GET`  | `/api/v1/health`  | Liveness check (deterministic, no external dependencies). Supports optional `?echo=...` query. |
| `GET`  | `/api/v1/version` | Returns API version and environment metadata.                                                  |

---

## 4. Response Contracts

### 4.1 Success Envelope

All successful JSON responses adhere to the standard envelope:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-09-10T03:00:00.000Z"
  },
  "meta": {
    "requestId": "req_8f14b2d5-91ab-433b-85ea-236b32df5a3c",
    "timestamp": "2026-09-10T03:00:00.000Z"
  }
}
```

### 4.2 Error Envelope

All API errors return a consistent, machine-readable envelope without leaking stack traces or internal implementation details:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "echo",
        "message": "Echo string must not exceed 50 characters"
      }
    ]
  },
  "meta": {
    "requestId": "req_8f14b2d5-91ab-433b-85ea-236b32df5a3c",
    "timestamp": "2026-09-10T03:00:00.000Z"
  }
}
```

### 4.3 Standard Error Codes

| Code                  | HTTP Status | Meaning                                              |
| --------------------- | ----------- | ---------------------------------------------------- |
| `VALIDATION_ERROR`    | 400 / 422   | Request parameters, query, or body failed validation |
| `BAD_REQUEST`         | 400         | Malformed request syntax                             |
| `UNAUTHORIZED`        | 401         | Missing or invalid authentication                    |
| `FORBIDDEN`           | 403         | Authenticated user lacks permission                  |
| `NOT_FOUND`           | 404         | Route or requested entity does not exist             |
| `METHOD_NOT_ALLOWED`  | 405         | HTTP method not supported for route                  |
| `CONFLICT`            | 409         | Resource state conflict (e.g. duplicate key)         |
| `RATE_LIMITED`        | 429         | Rate limit exceeded                                  |
| `INTERNAL_ERROR`      | 500         | Unhandled internal server error (masked safely)      |
| `SERVICE_UNAVAILABLE` | 503         | External dependency or service temporarily down      |

---

## 5. Middleware Pipeline

Incoming requests traverse the middleware pipeline in the following order:

```text
Request
  │
  ▼
1. Request ID (extracts or generates req_<uuid>, sets context & X-Request-ID header)
  │
  ▼
2. Request Logger (measures request duration, logs method, path, status, requestId)
  │
  ▼
3. CORS (validates Origin against WEB_ORIGIN, sets allow/expose headers)
  │
  ▼
[Extension Point: Security Headers / Helmet]
  │
  ▼
[Extension Point: Authentication]
  │
  ▼
[Extension Point: Rate Limiting]
  │
  ▼
4. Route Handlers (/api/v1/...)
  │
  ├──> 5. Not Found Handler (404 envelope on unmatched routes)
  │
  └──> 6. Centralized Error Handler (maps AppError, ZodError, HTTPException, or masks 500)
```

---

## 6. Environment Configuration

Configuration is validated on startup with Zod in [`src/config/env.ts`](src/config/env.ts):

| Variable       | Type     | Default                 | Description                                         |
| -------------- | -------- | ----------------------- | --------------------------------------------------- |
| `NODE_ENV`     | `enum`   | `development`           | `development`, `test`, or `production`              |
| `PORT`         | `number` | `4000`                  | HTTP port for local Node server                     |
| `API_ENV`      | `enum`   | `local`                 | `local`, `development`, `staging`, `production`     |
| `WEB_ORIGIN`   | `string` | `http://localhost:3000` | Allowed CORS origins (comma-separated for multiple) |
| `API_VERSION`  | `string` | `0.1.0`                 | API version returned by `/version`                  |
| `DATABASE_URL` | `string` | _(optional)_            | Neon PostgreSQL connection string                   |

---

## 7. Database Layer (Neon + Drizzle ORM)

The database layer is owned directly by `apps/api` in `src/infrastructure/database/`:

- **Serverless PostgreSQL**: Neon via `@neondatabase/serverless` using HTTP fetch queries.
- **Initial Tables**: `users` (canonical identity) and `candidate_profiles` (1-to-0..1 relation with cascade delete).
- **Vector Support**: `pgvector` extension enabled via initial migration (`CREATE EXTENSION IF NOT EXISTS vector;`).

Database scripts:

```bash
# Generate SQL migration from schema diff
pnpm --filter api db:generate

# Validate migration files
pnpm --filter api db:check

# Apply migrations to database
pnpm --filter api db:migrate

# Open Drizzle Studio database browser
pnpm --filter api db:studio
```

---

## 8. Development Scripts

Run commands from the repository root or within `apps/api`:

```bash
# Start local API dev server with hot reload
pnpm --filter api dev

# Build standalone production bundle
pnpm --filter api build

# Run TypeScript typecheck
pnpm --filter api check-types

# Run ESLint
pnpm --filter api lint

# Run Vitest test suite
pnpm --filter api test
```
