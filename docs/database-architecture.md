# Fulcra Database Architecture & Data Layer Standards

This document establishes the architectural standards, technology choices, and operational workflow for the Fulcra database layer.

---

## 1. Technology Decisions

### 1.1 Neon PostgreSQL

- **Serverless PostgreSQL**: Fulcra uses [Neon](https://neon.tech) as its primary relational database.
- **Serverless HTTP Driver**: The application connects using `@neondatabase/serverless` via standard HTTP `fetch` rather than persistent TCP connections. This eliminates connection pooling issues, scales instantly, supports scale-to-zero, and runs seamlessly in serverless and edge environments without proxy overhead.
- **Branching**: Neon database branching enables isolated, instant preview and test databases for development and CI pipelines.

### 1.2 Why Supabase Was NOT Chosen

- Supabase bundles Auth, Storage, Realtime, and Edge Functions into a proprietary BaaS ecosystem.
- Fulcra requires a decoupled, modular architecture where authentication, job discovery, ATS integrations, and AI pipelines are owned cleanly by our Hono API without vendor lock-in.

### 1.3 Why `packages/database` Does NOT Exist Yet

- At this stage, `apps/api` is the **only** database consumer.
- Creating a separate shared package prematurely introduces cross-package build overhead, symlink complexity, and version synchronization issues.
- If a future worker or secondary service requires direct database access, the `src/infrastructure/database` directory can be extracted into a shared workspace package cleanly.

### 1.4 Drizzle ORM & Drizzle Kit

- **Drizzle ORM**: Lightweight, TypeScript-native ORM with near-zero runtime overhead. Queries closely mirror SQL semantics, providing full type safety and type inference (`$inferSelect`, `$inferInsert`).
- **Drizzle Kit**: CLI for schema inspection, diffing, and automated SQL migration generation.

---

## 2. Directory Structure & Ownership

All database logic belongs strictly inside `apps/api/src/infrastructure/database/`:

```text
apps/api/
├── drizzle/                           # Versioned SQL migration files committed to Git
│   ├── 0000_naive_shiver_man.sql      # Initial schema & pgvector migration
│   └── meta/                          # Drizzle migration journal
├── drizzle.config.ts                  # Drizzle Kit configuration
└── src/
    └── infrastructure/
        └── database/
            ├── client.ts              # Neon HTTP driver & lazy safety proxy
            ├── migrate.ts             # Programmatic migration runner
            ├── schema/
            │   ├── users.ts           # Users table definition & inferred types
            │   ├── candidate-profiles.ts # Candidate profiles table & relations
            │   └── index.ts           # Schema barrel export
            └── index.ts               # Infrastructure barrel export
```

---

## 3. Initial Schema: Users & Candidate Profiles

The initial schema deliberately focuses on core identity and profile relations:

```text
┌─────────────────────────┐
│          users          │
├─────────────────────────┤
│ id: uuid (PK, default)  │
│ email: varchar(255) (UQ)│
│ name: varchar(255)      │
│ created_at: timestamptz │
│ updated_at: timestamptz │
└────────────┬────────────┘
             │ 1
             │
             │ 0..1
┌────────────▼────────────┐
│   candidate_profiles    │
├─────────────────────────┤
│ id: uuid (PK, default)  │
│ user_id: uuid (FK, UQ)  │──> users.id ON DELETE CASCADE
│ headline: varchar(255)  │
│ summary: text           │
│ created_at: timestamptz │
│ updated_at: timestamptz │
└─────────────────────────┘
```

### 3.1 Primary Key Strategy

- **UUID (`gen_random_uuid()`)**: All tables use database-generated UUIDs as primary keys.
- **Security**: Non-sequential UUIDs prevent enumeration attacks and are safe to expose across API boundaries.

### 3.2 Timestamps

- All tables define `created_at` and `updated_at` with PostgreSQL `timestamp with time zone` (`timestamptz`).
- Both default to `now()`.
- `updated_at` uses Drizzle's `$onUpdate(() => new Date())` hook to maintain fresh timestamps on record modification.

### 3.3 Relational Integrity & Constraints

- **Foreign Keys**: `candidate_profiles.user_id` references `users.id` with `ON DELETE CASCADE`.
- **Uniqueness**: `users.email` and `candidate_profiles.user_id` are enforced unique at the database level.

---

## 4. Vector Support (`pgvector`)

- **PostgreSQL Extension**: Enabled via migration `0000_naive_shiver_man.sql`:
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;
  ```
- **Future Vector Design**: Future embedding tables will track metadata explicitly:
  - `entity_id` (UUID foreign key)
  - `embedding` (`vector(dim)`)
  - `model` (e.g. `text-embedding-3-small`)
  - `dimensions` (e.g. `1536`)
  - `embedding_version`
  - `created_at`, `updated_at`
- Vector columns are **not** placed directly on business tables to ensure modularity across embedding models.

---

## 5. Migration Workflow

Migrations are mandatory and committed to version control:

```bash
# 1. Modify schema in src/infrastructure/database/schema/
# 2. Generate migration SQL:
pnpm --filter api db:generate

# 3. Validate migration integrity:
pnpm --filter api db:check

# 4. Apply migrations to target database:
pnpm --filter api db:migrate
```

Never alter production schemas manually through database consoles.

---

## 6. Testing Strategy

1. **Unit Tests** (`test/database/schema.test.ts`, `test/database/client.test.ts`):
   - Fast, in-memory tests verifying table names, column mappings, constraints, foreign keys, and relations without network access.
2. **PostgreSQL Integration Tests** (`test/database/integration.test.ts`):
   - Real queries executed against PostgreSQL when `DATABASE_URL` is configured.
   - Verifies `pgvector` extension, record insertion, relational queries, foreign key cascading, and unique constraint enforcement.
   - Gracefully skipped in hermetic/offline environments when `DATABASE_URL` is not set.

---

## 7. Security & Serverless Safety

- **No Credential Leaks**: `DATABASE_URL` is loaded via `src/config/env.ts` and sanitized by `src/infrastructure/logger/logger.ts`. Connection strings are never printed in logs or API responses.
- **Stateless Execution**: The client utilizes HTTP fetch queries, preventing connection leaks across short-lived serverless invocations.
