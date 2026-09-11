import { and, asc, desc, eq } from "drizzle-orm"
import {
  db as defaultDb,
  type FulcraDatabase,
} from "../../infrastructure/database/client"
import {
  candidateEducation,
  candidateExperiences,
  candidatePreferences,
  candidateProfiles,
  candidateSkills,
  type CandidateEducation,
  type CandidateExperience,
  type CandidatePreferences,
  type CandidateProfile,
  type CandidateSkill,
  type NewCandidateEducation,
  type NewCandidateExperience,
  type NewCandidatePreferences,
  type NewCandidateProfile,
  type NewCandidateSkill,
  users,
} from "../../infrastructure/database/schema"
import type { Principal } from "../../shared/types/context"

export interface CandidateRepository {
  ensureUser(principal: Principal): Promise<void>
  findProfileByUserId(userId: string): Promise<CandidateProfile | null>
  findProfileById(id: string): Promise<CandidateProfile | null>
  createProfile(data: NewCandidateProfile): Promise<CandidateProfile>
  updateProfile(
    id: string,
    data: Partial<NewCandidateProfile>
  ): Promise<CandidateProfile | null>
  deleteProfile(id: string): Promise<boolean>

  findAggregateByUserId(userId: string): Promise<{
    profile: CandidateProfile
    experiences: CandidateExperience[]
    education: CandidateEducation[]
    skills: CandidateSkill[]
    preferences: CandidatePreferences | null
  } | null>

  listExperiences(candidateProfileId: string): Promise<CandidateExperience[]>
  findExperienceById(id: string): Promise<CandidateExperience | null>
  createExperience(data: NewCandidateExperience): Promise<CandidateExperience>
  updateExperience(
    id: string,
    data: Partial<NewCandidateExperience>
  ): Promise<CandidateExperience | null>
  deleteExperience(id: string): Promise<boolean>

  listEducation(candidateProfileId: string): Promise<CandidateEducation[]>
  findEducationById(id: string): Promise<CandidateEducation | null>
  createEducation(data: NewCandidateEducation): Promise<CandidateEducation>
  updateEducation(
    id: string,
    data: Partial<NewCandidateEducation>
  ): Promise<CandidateEducation | null>
  deleteEducation(id: string): Promise<boolean>

  listSkills(candidateProfileId: string): Promise<CandidateSkill[]>
  findSkillById(id: string): Promise<CandidateSkill | null>
  findSkillByNormalizedName(
    candidateProfileId: string,
    name: string
  ): Promise<CandidateSkill | null>
  createSkill(data: NewCandidateSkill): Promise<CandidateSkill>
  updateSkill(
    id: string,
    data: Partial<NewCandidateSkill>
  ): Promise<CandidateSkill | null>
  deleteSkill(id: string): Promise<boolean>

  findPreferences(
    candidateProfileId: string
  ): Promise<CandidatePreferences | null>
  upsertPreferences(
    candidateProfileId: string,
    data: Partial<NewCandidatePreferences>
  ): Promise<CandidatePreferences>
}

export class DrizzleCandidateRepository implements CandidateRepository {
  constructor(private readonly db: FulcraDatabase = defaultDb) {}

  async ensureUser(principal: Principal): Promise<void> {
    const existing = await this.db
      .select()
      .from(users)
      .where(eq(users.id, principal.userId))
      .limit(1)

    if (existing.length === 0) {
      await this.db
        .insert(users)
        .values({
          id: principal.userId,
          email: principal.email,
          name: principal.name ?? null,
        })
        .onConflictDoNothing()
    }
  }

  async findProfileByUserId(userId: string): Promise<CandidateProfile | null> {
    const [profile] = await this.db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.userId, userId))
      .limit(1)

    return profile ?? null
  }

  async findProfileById(id: string): Promise<CandidateProfile | null> {
    const [profile] = await this.db
      .select()
      .from(candidateProfiles)
      .where(eq(candidateProfiles.id, id))
      .limit(1)

    return profile ?? null
  }

  async createProfile(data: NewCandidateProfile): Promise<CandidateProfile> {
    const [profile] = await this.db
      .insert(candidateProfiles)
      .values(data)
      .returning()

    return profile
  }

  async updateProfile(
    id: string,
    data: Partial<NewCandidateProfile>
  ): Promise<CandidateProfile | null> {
    const [updated] = await this.db
      .update(candidateProfiles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(candidateProfiles.id, id))
      .returning()

    return updated ?? null
  }

  async deleteProfile(id: string): Promise<boolean> {
    const result = await this.db
      .delete(candidateProfiles)
      .where(eq(candidateProfiles.id, id))
      .returning({ id: candidateProfiles.id })

    return result.length > 0
  }

  async findAggregateByUserId(userId: string): Promise<{
    profile: CandidateProfile
    experiences: CandidateExperience[]
    education: CandidateEducation[]
    skills: CandidateSkill[]
    preferences: CandidatePreferences | null
  } | null> {
    const profile = await this.findProfileByUserId(userId)
    if (!profile) return null

    const [experiences, education, skills, preferences] = await Promise.all([
      this.listExperiences(profile.id),
      this.listEducation(profile.id),
      this.listSkills(profile.id),
      this.findPreferences(profile.id),
    ])

    return {
      profile,
      experiences,
      education,
      skills,
      preferences,
    }
  }

  async listExperiences(
    candidateProfileId: string
  ): Promise<CandidateExperience[]> {
    return this.db
      .select()
      .from(candidateExperiences)
      .where(eq(candidateExperiences.candidateProfileId, candidateProfileId))
      .orderBy(
        asc(candidateExperiences.sortOrder),
        desc(candidateExperiences.startDate)
      )
  }

  async findExperienceById(id: string): Promise<CandidateExperience | null> {
    const [item] = await this.db
      .select()
      .from(candidateExperiences)
      .where(eq(candidateExperiences.id, id))
      .limit(1)

    return item ?? null
  }

  async createExperience(
    data: NewCandidateExperience
  ): Promise<CandidateExperience> {
    const [created] = await this.db
      .insert(candidateExperiences)
      .values(data)
      .returning()

    return created
  }

  async updateExperience(
    id: string,
    data: Partial<NewCandidateExperience>
  ): Promise<CandidateExperience | null> {
    const [updated] = await this.db
      .update(candidateExperiences)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(candidateExperiences.id, id))
      .returning()

    return updated ?? null
  }

  async deleteExperience(id: string): Promise<boolean> {
    const result = await this.db
      .delete(candidateExperiences)
      .where(eq(candidateExperiences.id, id))
      .returning({ id: candidateExperiences.id })

    return result.length > 0
  }

  async listEducation(
    candidateProfileId: string
  ): Promise<CandidateEducation[]> {
    return this.db
      .select()
      .from(candidateEducation)
      .where(eq(candidateEducation.candidateProfileId, candidateProfileId))
      .orderBy(
        asc(candidateEducation.sortOrder),
        desc(candidateEducation.startDate)
      )
  }

  async findEducationById(id: string): Promise<CandidateEducation | null> {
    const [item] = await this.db
      .select()
      .from(candidateEducation)
      .where(eq(candidateEducation.id, id))
      .limit(1)

    return item ?? null
  }

  async createEducation(
    data: NewCandidateEducation
  ): Promise<CandidateEducation> {
    const [created] = await this.db
      .insert(candidateEducation)
      .values(data)
      .returning()

    return created
  }

  async updateEducation(
    id: string,
    data: Partial<NewCandidateEducation>
  ): Promise<CandidateEducation | null> {
    const [updated] = await this.db
      .update(candidateEducation)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(candidateEducation.id, id))
      .returning()

    return updated ?? null
  }

  async deleteEducation(id: string): Promise<boolean> {
    const result = await this.db
      .delete(candidateEducation)
      .where(eq(candidateEducation.id, id))
      .returning({ id: candidateEducation.id })

    return result.length > 0
  }

  async listSkills(candidateProfileId: string): Promise<CandidateSkill[]> {
    return this.db
      .select()
      .from(candidateSkills)
      .where(eq(candidateSkills.candidateProfileId, candidateProfileId))
      .orderBy(asc(candidateSkills.sortOrder), asc(candidateSkills.name))
  }

  async findSkillById(id: string): Promise<CandidateSkill | null> {
    const [item] = await this.db
      .select()
      .from(candidateSkills)
      .where(eq(candidateSkills.id, id))
      .limit(1)

    return item ?? null
  }

  async findSkillByNormalizedName(
    candidateProfileId: string,
    name: string
  ): Promise<CandidateSkill | null> {
    const [item] = await this.db
      .select()
      .from(candidateSkills)
      .where(
        and(
          eq(candidateSkills.candidateProfileId, candidateProfileId),
          eq(candidateSkills.name, name)
        )
      )
      .limit(1)

    return item ?? null
  }

  async createSkill(data: NewCandidateSkill): Promise<CandidateSkill> {
    const [created] = await this.db
      .insert(candidateSkills)
      .values(data)
      .returning()

    return created
  }

  async updateSkill(
    id: string,
    data: Partial<NewCandidateSkill>
  ): Promise<CandidateSkill | null> {
    const [updated] = await this.db
      .update(candidateSkills)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(candidateSkills.id, id))
      .returning()

    return updated ?? null
  }

  async deleteSkill(id: string): Promise<boolean> {
    const result = await this.db
      .delete(candidateSkills)
      .where(eq(candidateSkills.id, id))
      .returning({ id: candidateSkills.id })

    return result.length > 0
  }

  async findPreferences(
    candidateProfileId: string
  ): Promise<CandidatePreferences | null> {
    const [item] = await this.db
      .select()
      .from(candidatePreferences)
      .where(eq(candidatePreferences.candidateProfileId, candidateProfileId))
      .limit(1)

    return item ?? null
  }

  async upsertPreferences(
    candidateProfileId: string,
    data: Partial<NewCandidatePreferences>
  ): Promise<CandidatePreferences> {
    const [result] = await this.db
      .insert(candidatePreferences)
      .values({
        candidateProfileId,
        ...data,
      })
      .onConflictDoUpdate({
        target: candidatePreferences.candidateProfileId,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      })
      .returning()

    return result
  }
}

export const candidateRepository = new DrizzleCandidateRepository()
