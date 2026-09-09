import { describe, expect, it } from "vitest"
import { eq, sql } from "drizzle-orm"
import { env } from "../../src/config/env"
import { createDbClient } from "../../src/infrastructure/database/client"
import {
  candidateProfiles,
  users,
} from "../../src/infrastructure/database/schema"

const hasDbConfig = Boolean(env.DATABASE_URL)

describe.runIf(hasDbConfig)("PostgreSQL & Neon Integration Tests", () => {
  const db = createDbClient()

  it("should have the pgvector extension enabled", async () => {
    const result = await db.execute(
      sql`SELECT extname FROM pg_extension WHERE extname = 'vector';`
    )
    expect(result).toBeDefined()
    const rows = Array.isArray(result)
      ? result
      : ((result as { rows?: Array<Record<string, unknown>> }).rows ?? [])
    expect(rows.length).toBeGreaterThan(0)
    expect((rows[0] as Record<string, unknown>).extname).toBe("vector")
  })

  it("should insert a user and candidate profile with constraints and foreign key", async () => {
    const testEmail = `test_${Date.now()}@example.com`

    // 1. Insert user
    const [user] = await db
      .insert(users)
      .values({
        email: testEmail,
        name: "Test Candidate",
      })
      .returning()

    expect(user).toBeDefined()
    expect(user.id).toBeDefined()
    expect(user.email).toBe(testEmail)

    // 2. Insert candidate profile referencing user
    const [profile] = await db
      .insert(candidateProfiles)
      .values({
        userId: user.id,
        headline: "Senior Software Engineer",
        summary: "Specialized in distributed systems and AI.",
      })
      .returning()

    expect(profile).toBeDefined()
    expect(profile.userId).toBe(user.id)
    expect(profile.headline).toBe("Senior Software Engineer")

    // 3. Verify unique constraint on email
    await expect(
      db.insert(users).values({
        email: testEmail,
        name: "Duplicate User",
      })
    ).rejects.toThrow()

    // 4. Verify cascade delete
    await db.delete(users).where(eq(users.id, user.id))

    const remainingProfile = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, user.id))

    expect(remainingProfile.length).toBe(0)
  })
})

describe.skipIf(hasDbConfig)("PostgreSQL Integration Tests (Skipped)", () => {
  it("skips live database integration tests when DATABASE_URL is not set", () => {
    console.info(
      "[INFO] Live database integration tests skipped because DATABASE_URL is not configured in this environment."
    )
    expect(true).toBe(true)
  })
})
