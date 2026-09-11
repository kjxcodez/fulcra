import { describe, expect, it } from "vitest"
import { eq } from "drizzle-orm"
import { env } from "../../src/config/env"
import { createDbClient } from "../../src/infrastructure/database/client"
import {
  candidateEducation,
  candidateExperiences,
  candidatePreferences,
  candidateProfiles,
  candidateSkills,
  users,
} from "../../src/infrastructure/database/schema"

const hasDbConfig = Boolean(env.DATABASE_URL)

describe.runIf(hasDbConfig)("Candidate PostgreSQL Integration Tests", () => {
  const db = createDbClient()

  it("should create candidate profile, child entities and enforce cascading deletes", async () => {
    const testEmail = `candidate_test_${Date.now()}@example.com`

    // 1. Create User
    const [user] = await db
      .insert(users)
      .values({
        email: testEmail,
        name: "Jane Candidate",
      })
      .returning()

    expect(user).toBeDefined()

    // 2. Create Candidate Profile with structured location & contact
    const [profile] = await db
      .insert(candidateProfiles)
      .values({
        userId: user.id,
        displayName: "Jane C.",
        headline: "Staff Systems Engineer",
        summary: "Passionate about high-throughput distributed systems.",
        phone: "+1 555-0199",
        city: "San Francisco",
        state: "CA",
        country: "USA",
        postalCode: "94105",
      })
      .returning()

    expect(profile).toBeDefined()
    expect(profile.displayName).toBe("Jane C.")
    expect(profile.city).toBe("San Francisco")

    // 3. Create Experiences
    const [exp1] = await db
      .insert(candidateExperiences)
      .values({
        candidateProfileId: profile.id,
        companyName: "Acme Corp",
        title: "Senior Backend Engineer",
        employmentType: "full-time",
        location: "Remote",
        startDate: "2021-06",
        endDate: "2023-12",
        isCurrent: false,
        description: "Architected microservices infrastructure.",
        sortOrder: 1,
      })
      .returning()

    expect(exp1).toBeDefined()
    expect(exp1.candidateProfileId).toBe(profile.id)

    // 4. Create Education
    const [edu1] = await db
      .insert(candidateEducation)
      .values({
        candidateProfileId: profile.id,
        institution: "University of California, Berkeley",
        degree: "B.S.",
        fieldOfStudy: "Computer Science",
        startDate: "2017-09",
        endDate: "2021-05",
        isCurrent: false,
        sortOrder: 0,
      })
      .returning()

    expect(edu1).toBeDefined()
    expect(edu1.institution).toBe("University of California, Berkeley")

    // 5. Create Skills
    const [skill1] = await db
      .insert(candidateSkills)
      .values({
        candidateProfileId: profile.id,
        name: "typescript",
        displayName: "TypeScript",
        proficiency: "expert",
        yearsOfExperience: 5,
        sortOrder: 0,
      })
      .returning()

    expect(skill1).toBeDefined()
    expect(skill1.name).toBe("typescript")

    // 6. Enforce Skill Uniqueness: duplicate (candidateProfileId, name) must fail
    await expect(
      db.insert(candidateSkills).values({
        candidateProfileId: profile.id,
        name: "typescript",
        displayName: "TypeScript",
        proficiency: "advanced",
      })
    ).rejects.toThrow()

    // 7. Create Preferences
    const [pref1] = await db
      .insert(candidatePreferences)
      .values({
        candidateProfileId: profile.id,
        desiredJobTitles: ["Staff Software Engineer", "Principal Engineer"],
        desiredEmploymentTypes: ["full-time"],
        workLocationPreference: "remote",
        preferredLocations: ["Remote - US", "San Francisco, CA"],
        salaryCurrency: "USD",
        salaryMinimum: 180000,
        salaryMaximum: 240000,
        relocationPreference: "no",
        sponsorshipRequired: false,
      })
      .returning()

    expect(pref1).toBeDefined()
    expect(pref1.workLocationPreference).toBe("remote")
    expect(pref1.desiredJobTitles).toEqual([
      "Staff Software Engineer",
      "Principal Engineer",
    ])

    // 8. Enforce Preferences 1:1 uniqueness constraint
    await expect(
      db.insert(candidatePreferences).values({
        candidateProfileId: profile.id,
        workLocationPreference: "hybrid",
      })
    ).rejects.toThrow()

    // 9. Verify Cascade Deletion from User -> Profile -> Child records
    await db.delete(users).where(eq(users.id, user.id))

    const remainingProfile = await db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.id, profile.id))
    expect(remainingProfile.length).toBe(0)

    const remainingExp = await db
      .select()
      .from(candidateExperiences)
      .where(eq(candidateExperiences.candidateProfileId, profile.id))
    expect(remainingExp.length).toBe(0)

    const remainingEdu = await db
      .select()
      .from(candidateEducation)
      .where(eq(candidateEducation.candidateProfileId, profile.id))
    expect(remainingEdu.length).toBe(0)

    const remainingSkills = await db
      .select()
      .from(candidateSkills)
      .where(eq(candidateSkills.candidateProfileId, profile.id))
    expect(remainingSkills.length).toBe(0)

    const remainingPref = await db
      .select()
      .from(candidatePreferences)
      .where(eq(candidatePreferences.candidateProfileId, profile.id))
    expect(remainingPref.length).toBe(0)
  })
})
