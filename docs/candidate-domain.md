# Fulcra Candidate Domain Architecture

## 1. Domain Responsibility & Philosophy

The **Candidate Domain** establishes Fulcra's canonical representation of a person. All subsequent product capabilities — resume parsing, ATS diagnostic analysis, role matching, automated job applications, recruiter workflows, and AI enrichment — build directly upon this foundation.

Rather than collapsing candidate data into an opaque JSON blob or a giant denormalized table, the Candidate domain is composed of focused, normalized entities:

```text
User
  │
  └── Candidate Profile (1:1)
        ├── Identity & Contact (Display name, headline, summary, phone)
        ├── Structured Location (City, state/region, country, postal code)
        ├── Experiences (1:Many normalized career history)
        ├── Education (1:Many normalized academic history)
        ├── Skills (1:Many normalized competencies with proficiency & years)
        └── Preferences (1:1 career/job-search preferences)
```

---

## 2. Relationship to User & Identity

Phase 4 established the foundational identity relationship:

```text
users
  1
  │
  └── 0..1 candidate_profiles
```

The Candidate domain strictly preserves this relationship without introducing competing identity models (no `candidate_users` or `candidate_accounts`).

- `users` owns system-level identity, authentication identifiers (such as email), and global timestamps.
- `candidate_profiles` references `users.id` with a database-level `UNIQUE` constraint and `ON DELETE CASCADE`.
- A user may possess at most one candidate profile.

---

## 3. Database Schema & Referential Integrity

All candidate persistence is normalized in PostgreSQL via Drizzle ORM inside `apps/api/src/infrastructure/database/schema/`:

```text
apps/api/src/infrastructure/database/schema/
├── users.ts                   # Core user table
├── candidate-profiles.ts       # Canonical candidate profile root
├── candidate-experiences.ts    # Normalized career history
├── candidate-education.ts      # Normalized academic records
├── candidate-skills.ts         # Normalized skills with unique constraint
├── candidate-preferences.ts    # Career / job-search preferences
└── index.ts                   # Barrel export
```

### 3.1 Referential Integrity & Cascading Deletion Policy

Relational integrity is guaranteed by PostgreSQL foreign key constraints:

- `candidate_profiles.user_id` -> `users.id` (`ON DELETE CASCADE`)
- `candidate_experiences.candidate_profile_id` -> `candidate_profiles.id` (`ON DELETE CASCADE`)
- `candidate_education.candidate_profile_id` -> `candidate_profiles.id` (`ON DELETE CASCADE`)
- `candidate_skills.candidate_profile_id` -> `candidate_profiles.id` (`ON DELETE CASCADE`)
- `candidate_preferences.candidate_profile_id` -> `candidate_profiles.id` (`ON DELETE CASCADE`, `UNIQUE`)

**Deletion Policy**: Deleting a `users` record or a `candidate_profiles` record deterministically cascades to all child records, eliminating orphaned data without requiring multi-query manual cleanups.

### 3.2 Uniqueness Constraints & Normalization

- **Skills**: Enforced unique per profile via `candidate_skills_profile_name_unique` on `(candidate_profile_id, name)`. Skill names are normalized to trimmed lowercase strings at the service layer before persistence to ensure case-insensitive deduplication.
- **Preferences**: Enforced strictly 1:1 with candidate profile via `candidate_preferences_candidate_profile_id_unique`.

---

## 4. Ownership Model & Authentication Boundary

A candidate resource must only ever be accessible to the authenticated user who owns it.

```text
HTTP Request
     ↓
Principal Middleware (Resolves trusted Principal from session/headers)
     ↓
Route Handler (passes c.get("principal") to service)
     ↓
Candidate Service (Validates ownership against principal.userId)
     ↓
Candidate Repository
     ↓
PostgreSQL Database
```

### 4.1 Authorization Interface

The application derives authorization context from `Principal`:

```typescript
export interface Principal {
  userId: string
  email: string
  name?: string
  isAnonymous?: boolean
}
```

- Clients **never** provide `userId`, `candidateId`, or `ownerId` in request bodies to assert identity.
- The service layer retrieves the candidate profile by `principal.userId`.
- Any mutation to child resources (experiences, education, skills, preferences) verifies that `child.candidateProfileId === profile.id`. If a user attempts to modify or delete a resource owned by another profile, the service returns `403 CANDIDATE_ACCESS_DENIED`.

### 4.2 Temporary Development Infrastructure

In Phase 7, full production authentication (e.g. Clerk, Auth.js) is not yet integrated. The system uses a documented principal resolution middleware (`apps/api/src/middleware/principal.ts`):

- In `development` and `test` environments:
  - If `X-User-Id` header is supplied, a deterministic test principal is constructed (enabling multi-tenant isolation tests).
  - If omitted, it falls back to a static developer principal (`dev-user-00000000-0000-0000-0000-000000000001`).
- In `production` environment:
  - Missing authentication credentials immediately yield `401 UNAUTHORIZED`. This serves as the clean architectural insertion point for future JWT/session verification.

---

## 5. Feature Architecture & Layer Boundaries

Candidate functionality is encapsulated under `apps/api/src/features/candidates/`:

```text
apps/api/src/features/candidates/
├── candidate.route.ts       # Thin HTTP transport & response handling
├── candidate.schema.ts      # Zod validation schemas
├── candidate.service.ts     # Business rules & ownership enforcement
├── candidate.repository.ts  # Database access layer
├── candidate.types.ts       # Domain DTOs and aggregate models
└── index.ts                 # Public feature exports
```

### Layer Responsibilities

1. **Route (`candidate.route.ts`)**:
   - Thin Hono router mounted under `/api/v1/candidate`.
   - Validates inputs using `validate("json" | "param" | "query", schema)`.
   - Delegates business operations directly to `candidateService`.
   - Returns responses using standardized envelopes via `sendSuccess()`.
2. **Service (`candidate.service.ts`)**:
   - Enforces ownership rules.
   - Enforces business invariants: date chronology (`startDate <= endDate`), duplicate skill prevention, salary bounds (`salaryMinimum <= salaryMaximum`).
   - Maps database rows to domain DTOs.
3. **Repository (`candidate.repository.ts`)**:
   - Executes queries against Drizzle ORM and PostgreSQL.
   - Hides SQL details and schema internals from the rest of the application.

---

## 6. API Resource Design & Endpoints

All endpoints are resource-oriented and mounted under `/api/v1/candidate`:

| Method   | Endpoint                            | Description                                                     |
| -------- | ----------------------------------- | --------------------------------------------------------------- |
| `GET`    | `/api/v1/candidate`                 | Retrieve the canonical candidate aggregate resource             |
| `POST`   | `/api/v1/candidate`                 | Create canonical candidate profile for authenticated user       |
| `PATCH`  | `/api/v1/candidate`                 | Update candidate profile fields (identity, summary, location)   |
| `DELETE` | `/api/v1/candidate`                 | Delete candidate profile and cascade delete all child data      |
| `GET`    | `/api/v1/candidate/experiences`     | List experiences ordered by `sortOrder`, `startDate DESC`       |
| `POST`   | `/api/v1/candidate/experiences`     | Create candidate experience                                     |
| `PATCH`  | `/api/v1/candidate/experiences/:id` | Update candidate experience                                     |
| `DELETE` | `/api/v1/candidate/experiences/:id` | Delete candidate experience                                     |
| `GET`    | `/api/v1/candidate/education`       | List education records ordered by `sortOrder`, `startDate DESC` |
| `POST`   | `/api/v1/candidate/education`       | Create education record                                         |
| `PATCH`  | `/api/v1/candidate/education/:id`   | Update education record                                         |
| `DELETE` | `/api/v1/candidate/education/:id`   | Delete education record                                         |
| `GET`    | `/api/v1/candidate/skills`          | List candidate skills ordered by `sortOrder`, `name`            |
| `POST`   | `/api/v1/candidate/skills`          | Add normalized skill to profile (rejects duplicates)            |
| `PATCH`  | `/api/v1/candidate/skills/:id`      | Update skill proficiency or experience                          |
| `DELETE` | `/api/v1/candidate/skills/:id`      | Remove skill from profile                                       |
| `GET`    | `/api/v1/candidate/preferences`     | Retrieve career/job-search preferences                          |
| `PATCH`  | `/api/v1/candidate/preferences`     | Upsert career/job-search preferences                            |

### Candidate Resource Shape

Representative response from `GET /api/v1/candidate`:

```json
{
  "success": true,
  "data": {
    "id": "2d8f99e3-8551-460d-8ea2-d961e687d853",
    "userId": "00000000-0000-0000-0000-000000000001",
    "profile": {
      "displayName": "Alex Rivera",
      "headline": "Staff Distributed Systems Engineer",
      "summary": "10+ years architecting high-throughput event platforms.",
      "phone": "+1 (555) 019-2834",
      "location": {
        "city": "Seattle",
        "state": "WA",
        "country": "USA",
        "postalCode": "98101"
      }
    },
    "experiences": [
      {
        "id": "01b7a2d8-4f51-4e78-98e3-a98263152684",
        "candidateProfileId": "2d8f99e3-8551-460d-8ea2-d961e687d853",
        "companyName": "Acme Systems",
        "title": "Staff Engineer",
        "employmentType": "full-time",
        "location": "Remote - US",
        "startDate": "2021-06",
        "endDate": null,
        "isCurrent": true,
        "description": "Architected low-latency streaming pipeline handling 500k eps.",
        "sortOrder": 0,
        "createdAt": "2026-09-10T19:29:53.000Z",
        "updatedAt": "2026-09-10T19:29:53.000Z"
      }
    ],
    "education": [
      {
        "id": "77dfa812-3b1a-4c28-bb84-2a623a890184",
        "candidateProfileId": "2d8f99e3-8551-460d-8ea2-d961e687d853",
        "institution": "University of Washington",
        "degree": "B.S.",
        "fieldOfStudy": "Computer Science",
        "startDate": "2015-09",
        "endDate": "2019-06",
        "isCurrent": false,
        "description": "Magna cum laude.",
        "sortOrder": 0,
        "createdAt": "2026-09-10T19:29:53.000Z",
        "updatedAt": "2026-09-10T19:29:53.000Z"
      }
    ],
    "skills": [
      {
        "id": "99ea0124-789a-4f56-ba12-881273619284",
        "candidateProfileId": "2d8f99e3-8551-460d-8ea2-d961e687d853",
        "name": "typescript",
        "displayName": "TypeScript",
        "proficiency": "expert",
        "yearsOfExperience": 7,
        "sortOrder": 0,
        "createdAt": "2026-09-10T19:29:53.000Z",
        "updatedAt": "2026-09-10T19:29:53.000Z"
      }
    ],
    "preferences": {
      "id": "11bb22cc-33dd-44ee-55ff-66aa77bb88cc",
      "candidateProfileId": "2d8f99e3-8551-460d-8ea2-d961e687d853",
      "desiredJobTitles": ["Staff Software Engineer", "Principal Architect"],
      "desiredEmploymentTypes": ["full-time"],
      "workLocationPreference": "remote",
      "preferredLocations": ["Remote - US"],
      "salaryCurrency": "USD",
      "salaryMinimum": 210000,
      "salaryMaximum": 260000,
      "relocationPreference": "no",
      "sponsorshipRequired": false,
      "createdAt": "2026-09-10T19:29:53.000Z",
      "updatedAt": "2026-09-10T19:29:53.000Z"
    },
    "createdAt": "2026-09-10T19:29:52.000Z",
    "updatedAt": "2026-09-10T19:29:52.000Z"
  },
  "meta": {
    "requestId": "req_5f8a7e12-3e28-40a1-9a74-b9281726a100",
    "timestamp": "2026-09-10T19:29:53.120Z"
  }
}
```

---

## 7. Error Codes

Candidate domain errors extend the centralized error catalog (`apps/api/src/shared/errors/error-codes.ts`):

- `CANDIDATE_NOT_FOUND` (404): Candidate profile does not exist for the user.
- `CANDIDATE_ALREADY_EXISTS` (409): User already has an existing candidate profile.
- `CANDIDATE_ACCESS_DENIED` (403): User attempted to modify or delete a child resource owned by another profile.
- `EXPERIENCE_NOT_FOUND` (404): Experience record does not exist.
- `EDUCATION_NOT_FOUND` (404): Education record does not exist.
- `SKILL_ALREADY_EXISTS` (409): Normalized skill name already exists on profile.
- `SKILL_NOT_FOUND` (404): Skill record does not exist.
- `PREFERENCES_NOT_FOUND` (404): Preference record does not exist.
- `INVALID_CANDIDATE_STATE` (400): Invariant failure (e.g. `startDate > endDate`, `salaryMinimum > salaryMaximum`).

All errors return the standardized error envelope with `success: false` and `meta.requestId`.

---

## 8. Web Application Integration

The Next.js frontend (`apps/web`) consumes the Candidate domain through typed API client functions (`apps/web/lib/api-client.ts`):

- React components do not call `fetch()` directly.
- The UI layer lives in `apps/web/app/candidate/page.tsx` and `apps/web/components/fulcra/candidate/`.
- Correctly handles all states:
  - **Loading**: Skeletons mirroring the candidate card layout.
  - **Empty**: Accessible empty state with CTA to create a canonical profile.
  - **Success**: Interactive profile hero, experiences list, education list, skills chips, and career preferences form.
  - **Validation Errors & Server Errors**: Inline alerts and field-level validation feedback.
  - **Saving / Saved**: Action feedback on mutations.

---

## 9. Privacy & Sensitive Data Safeguards

Candidate information constitutes personally identifiable information (PII). The system enforces:

- **No full candidate payload logging**: Structured logger logs request metadata (`requestId`, method, path, status, duration) but excludes candidate profile summaries, contact numbers, and resumes.
- **Synthetic Test Data**: Vitest integration and unit tests use synthetic, generated UUIDs and fake test emails (`test_*@example.com`, `user_*@fulcra.local`). Real person records are never hardcoded.
- **Secure Error Propagation**: Database connection strings, stack traces, and internal database error messages are masked by `apps/api/src/middleware/error-handler.ts`.

---

## 10. Future Evolution: Resumes, ATS Analysis, Matching & Provenance

Phase 7 intentionally focuses strictly on the canonical candidate domain. Subsequent phases will build upon this foundation:

```text
Canonical Candidate Profile
          │
          ├── Resumes & Documents (Phase 8+)
          │     └── Resumes linked to CandidateProfileId, with versioning
          │
          ├── Provenance Tracking (Phase 9+)
          │     └── Distinguishing user-asserted facts vs. AI-extracted facts
          │
          ├── Vector Embeddings (Phase 10+)
          │     └── pgvector embeddings of skills and experience summaries
          │
          └── Job Matching & ATS Workflows (Phase 11+)
                └── Comparing CandidateProfile competencies against job requirements
```
