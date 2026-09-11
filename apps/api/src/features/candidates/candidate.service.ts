import { AppError } from "../../shared/errors/app-error"
import type { Principal } from "../../shared/types/context"
import {
  candidateRepository as defaultRepository,
  type CandidateRepository,
} from "./candidate.repository"
import type {
  CreateCandidateProfileInput,
  CreateEducationInput,
  CreateExperienceInput,
  CreateSkillInput,
  UpdateCandidateProfileInput,
  UpdateEducationInput,
  UpdateExperienceInput,
  UpdatePreferencesInput,
  UpdateSkillInput,
} from "./candidate.schema"
import type {
  CandidateAggregateDto,
  CandidateEducationDto,
  CandidateExperienceDto,
  CandidatePreferencesDto,
  CandidateProfileDto,
  CandidateSkillDto,
} from "./candidate.types"
import type {
  CandidateEducation,
  CandidateExperience,
  CandidatePreferences,
  CandidateProfile,
  CandidateSkill,
} from "../../infrastructure/database/schema"

export class CandidateService {
  constructor(
    private readonly repository: CandidateRepository = defaultRepository
  ) {}

  private toProfileDto(p: CandidateProfile): CandidateProfileDto {
    return {
      id: p.id,
      userId: p.userId,
      displayName: p.displayName,
      headline: p.headline,
      summary: p.summary,
      phone: p.phone,
      location: {
        city: p.city,
        state: p.state,
        country: p.country,
        postalCode: p.postalCode,
      },
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }
  }

  private toExperienceDto(exp: CandidateExperience): CandidateExperienceDto {
    return {
      id: exp.id,
      candidateProfileId: exp.candidateProfileId,
      companyName: exp.companyName,
      title: exp.title,
      employmentType: exp.employmentType,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      description: exp.description,
      sortOrder: exp.sortOrder,
      createdAt: exp.createdAt.toISOString(),
      updatedAt: exp.updatedAt.toISOString(),
    }
  }

  private toEducationDto(edu: CandidateEducation): CandidateEducationDto {
    return {
      id: edu.id,
      candidateProfileId: edu.candidateProfileId,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      isCurrent: edu.isCurrent,
      description: edu.description,
      sortOrder: edu.sortOrder,
      createdAt: edu.createdAt.toISOString(),
      updatedAt: edu.updatedAt.toISOString(),
    }
  }

  private toSkillDto(skill: CandidateSkill): CandidateSkillDto {
    return {
      id: skill.id,
      candidateProfileId: skill.candidateProfileId,
      name: skill.name,
      displayName: skill.displayName,
      proficiency: skill.proficiency,
      yearsOfExperience: skill.yearsOfExperience,
      sortOrder: skill.sortOrder,
      createdAt: skill.createdAt.toISOString(),
      updatedAt: skill.updatedAt.toISOString(),
    }
  }

  private toPreferencesDto(
    pref: CandidatePreferences
  ): CandidatePreferencesDto {
    return {
      id: pref.id,
      candidateProfileId: pref.candidateProfileId,
      desiredJobTitles: pref.desiredJobTitles ?? [],
      desiredEmploymentTypes: pref.desiredEmploymentTypes ?? [],
      workLocationPreference: pref.workLocationPreference,
      preferredLocations: pref.preferredLocations ?? [],
      salaryCurrency: pref.salaryCurrency,
      salaryMinimum: pref.salaryMinimum,
      salaryMaximum: pref.salaryMaximum,
      relocationPreference: pref.relocationPreference,
      sponsorshipRequired: pref.sponsorshipRequired,
      createdAt: pref.createdAt.toISOString(),
      updatedAt: pref.updatedAt.toISOString(),
    }
  }

  private async getProfileOrThrow(userId: string): Promise<CandidateProfile> {
    const profile = await this.repository.findProfileByUserId(userId)
    if (!profile) {
      throw AppError.candidateNotFound(
        "Candidate profile does not exist for this user"
      )
    }
    return profile
  }

  private validateDates(
    startDate?: string | null,
    endDate?: string | null,
    isCurrent?: boolean
  ) {
    if (!startDate || !endDate || isCurrent) return
    if (startDate > endDate) {
      throw AppError.invalidCandidateState(
        "Start date cannot be after end date",
        [{ field: "startDate", message: "Start date cannot be after end date" }]
      )
    }
  }

  // --- Profile Operations ---

  async getCandidate(principal: Principal): Promise<CandidateAggregateDto> {
    const aggregate = await this.repository.findAggregateByUserId(
      principal.userId
    )
    if (!aggregate) {
      throw AppError.candidateNotFound(
        "Candidate profile does not exist. Please create a profile first."
      )
    }

    return {
      id: aggregate.profile.id,
      userId: aggregate.profile.userId,
      profile: {
        displayName: aggregate.profile.displayName,
        headline: aggregate.profile.headline,
        summary: aggregate.profile.summary,
        phone: aggregate.profile.phone,
        location: {
          city: aggregate.profile.city,
          state: aggregate.profile.state,
          country: aggregate.profile.country,
          postalCode: aggregate.profile.postalCode,
        },
      },
      experiences: aggregate.experiences.map((exp) =>
        this.toExperienceDto(exp)
      ),
      education: aggregate.education.map((edu) => this.toEducationDto(edu)),
      skills: aggregate.skills.map((skill) => this.toSkillDto(skill)),
      preferences: aggregate.preferences
        ? this.toPreferencesDto(aggregate.preferences)
        : null,
      createdAt: aggregate.profile.createdAt.toISOString(),
      updatedAt: aggregate.profile.updatedAt.toISOString(),
    }
  }

  async createProfile(
    principal: Principal,
    input: CreateCandidateProfileInput
  ): Promise<CandidateProfileDto> {
    await this.repository.ensureUser(principal)

    const existing = await this.repository.findProfileByUserId(principal.userId)
    if (existing) {
      throw AppError.candidateAlreadyExists(
        "A candidate profile already exists for this account"
      )
    }

    const created = await this.repository.createProfile({
      userId: principal.userId,
      displayName: input.displayName ?? principal.name ?? null,
      headline: input.headline ?? null,
      summary: input.summary ?? null,
      phone: input.phone ?? null,
      city: input.location?.city ?? null,
      state: input.location?.state ?? null,
      country: input.location?.country ?? null,
      postalCode: input.location?.postalCode ?? null,
    })

    return this.toProfileDto(created)
  }

  async updateProfile(
    principal: Principal,
    input: UpdateCandidateProfileInput
  ): Promise<CandidateProfileDto> {
    const profile = await this.getProfileOrThrow(principal.userId)

    const updateData: Partial<CandidateProfile> = {}
    if (input.displayName !== undefined)
      updateData.displayName = input.displayName
    if (input.headline !== undefined) updateData.headline = input.headline
    if (input.summary !== undefined) updateData.summary = input.summary
    if (input.phone !== undefined) updateData.phone = input.phone
    if (input.location !== undefined) {
      if (input.location?.city !== undefined)
        updateData.city = input.location.city
      if (input.location?.state !== undefined)
        updateData.state = input.location.state
      if (input.location?.country !== undefined)
        updateData.country = input.location.country
      if (input.location?.postalCode !== undefined)
        updateData.postalCode = input.location.postalCode
    }

    const updated = await this.repository.updateProfile(profile.id, updateData)
    if (!updated) {
      throw AppError.candidateNotFound()
    }

    return this.toProfileDto(updated)
  }

  async deleteProfile(principal: Principal): Promise<{ success: true }> {
    const profile = await this.getProfileOrThrow(principal.userId)
    await this.repository.deleteProfile(profile.id)
    return { success: true }
  }

  // --- Experience Operations ---

  async listExperiences(
    principal: Principal
  ): Promise<CandidateExperienceDto[]> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const list = await this.repository.listExperiences(profile.id)
    return list.map((exp) => this.toExperienceDto(exp))
  }

  async createExperience(
    principal: Principal,
    input: CreateExperienceInput
  ): Promise<CandidateExperienceDto> {
    const profile = await this.getProfileOrThrow(principal.userId)
    this.validateDates(input.startDate, input.endDate, input.isCurrent)

    const created = await this.repository.createExperience({
      candidateProfileId: profile.id,
      companyName: input.companyName,
      title: input.title,
      employmentType: input.employmentType ?? null,
      location: input.location ?? null,
      startDate: input.startDate,
      endDate: input.isCurrent ? null : (input.endDate ?? null),
      isCurrent: input.isCurrent ?? false,
      description: input.description ?? null,
      sortOrder: input.sortOrder ?? 0,
    })

    return this.toExperienceDto(created)
  }

  async updateExperience(
    principal: Principal,
    id: string,
    input: UpdateExperienceInput
  ): Promise<CandidateExperienceDto> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const experience = await this.repository.findExperienceById(id)

    if (!experience) {
      throw AppError.experienceNotFound()
    }

    if (experience.candidateProfileId !== profile.id) {
      throw AppError.candidateAccessDenied(
        "Not authorized to modify this experience record"
      )
    }

    const effectiveStartDate = input.startDate ?? experience.startDate
    const effectiveIsCurrent =
      input.isCurrent !== undefined ? input.isCurrent : experience.isCurrent
    const effectiveEndDate = effectiveIsCurrent
      ? null
      : input.endDate !== undefined
        ? input.endDate
        : experience.endDate

    this.validateDates(effectiveStartDate, effectiveEndDate, effectiveIsCurrent)

    const updated = await this.repository.updateExperience(id, {
      ...input,
      ...(effectiveIsCurrent ? { endDate: null } : {}),
    })

    if (!updated) {
      throw AppError.experienceNotFound()
    }

    return this.toExperienceDto(updated)
  }

  async deleteExperience(
    principal: Principal,
    id: string
  ): Promise<{ success: true }> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const experience = await this.repository.findExperienceById(id)

    if (!experience) {
      throw AppError.experienceNotFound()
    }

    if (experience.candidateProfileId !== profile.id) {
      throw AppError.candidateAccessDenied(
        "Not authorized to delete this experience record"
      )
    }

    await this.repository.deleteExperience(id)
    return { success: true }
  }

  // --- Education Operations ---

  async listEducation(principal: Principal): Promise<CandidateEducationDto[]> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const list = await this.repository.listEducation(profile.id)
    return list.map((edu) => this.toEducationDto(edu))
  }

  async createEducation(
    principal: Principal,
    input: CreateEducationInput
  ): Promise<CandidateEducationDto> {
    const profile = await this.getProfileOrThrow(principal.userId)
    this.validateDates(input.startDate, input.endDate, input.isCurrent)

    const created = await this.repository.createEducation({
      candidateProfileId: profile.id,
      institution: input.institution,
      degree: input.degree ?? null,
      fieldOfStudy: input.fieldOfStudy ?? null,
      startDate: input.startDate ?? null,
      endDate: input.isCurrent ? null : (input.endDate ?? null),
      isCurrent: input.isCurrent ?? false,
      description: input.description ?? null,
      sortOrder: input.sortOrder ?? 0,
    })

    return this.toEducationDto(created)
  }

  async updateEducation(
    principal: Principal,
    id: string,
    input: UpdateEducationInput
  ): Promise<CandidateEducationDto> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const education = await this.repository.findEducationById(id)

    if (!education) {
      throw AppError.educationNotFound()
    }

    if (education.candidateProfileId !== profile.id) {
      throw AppError.candidateAccessDenied(
        "Not authorized to modify this education record"
      )
    }

    const effectiveStartDate =
      input.startDate !== undefined ? input.startDate : education.startDate
    const effectiveIsCurrent =
      input.isCurrent !== undefined ? input.isCurrent : education.isCurrent
    const effectiveEndDate = effectiveIsCurrent
      ? null
      : input.endDate !== undefined
        ? input.endDate
        : education.endDate

    this.validateDates(effectiveStartDate, effectiveEndDate, effectiveIsCurrent)

    const updated = await this.repository.updateEducation(id, {
      ...input,
      ...(effectiveIsCurrent ? { endDate: null } : {}),
    })

    if (!updated) {
      throw AppError.educationNotFound()
    }

    return this.toEducationDto(updated)
  }

  async deleteEducation(
    principal: Principal,
    id: string
  ): Promise<{ success: true }> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const education = await this.repository.findEducationById(id)

    if (!education) {
      throw AppError.educationNotFound()
    }

    if (education.candidateProfileId !== profile.id) {
      throw AppError.candidateAccessDenied(
        "Not authorized to delete this education record"
      )
    }

    await this.repository.deleteEducation(id)
    return { success: true }
  }

  // --- Skills Operations ---

  async listSkills(principal: Principal): Promise<CandidateSkillDto[]> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const list = await this.repository.listSkills(profile.id)
    return list.map((s) => this.toSkillDto(s))
  }

  async createSkill(
    principal: Principal,
    input: CreateSkillInput
  ): Promise<CandidateSkillDto> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const normalizedName = input.name.trim().toLowerCase()

    const existingSkill = await this.repository.findSkillByNormalizedName(
      profile.id,
      normalizedName
    )
    if (existingSkill) {
      throw AppError.skillAlreadyExists(
        `Skill "${input.name.trim()}" already exists in your profile`
      )
    }

    const created = await this.repository.createSkill({
      candidateProfileId: profile.id,
      name: normalizedName,
      displayName: input.displayName?.trim() || input.name.trim(),
      proficiency: input.proficiency ?? null,
      yearsOfExperience: input.yearsOfExperience ?? null,
      sortOrder: input.sortOrder ?? 0,
    })

    return this.toSkillDto(created)
  }

  async updateSkill(
    principal: Principal,
    id: string,
    input: UpdateSkillInput
  ): Promise<CandidateSkillDto> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const skill = await this.repository.findSkillById(id)

    if (!skill) {
      throw AppError.skillNotFound()
    }

    if (skill.candidateProfileId !== profile.id) {
      throw AppError.candidateAccessDenied(
        "Not authorized to modify this skill record"
      )
    }

    const updateData: Partial<CandidateSkill> = {}

    if (input.name !== undefined) {
      const normalizedName = input.name.trim().toLowerCase()
      if (normalizedName !== skill.name) {
        const duplicate = await this.repository.findSkillByNormalizedName(
          profile.id,
          normalizedName
        )
        if (duplicate && duplicate.id !== id) {
          throw AppError.skillAlreadyExists(
            `Skill "${input.name.trim()}" already exists in your profile`
          )
        }
      }
      updateData.name = normalizedName
      updateData.displayName = input.displayName?.trim() || input.name.trim()
    } else if (input.displayName !== undefined) {
      updateData.displayName = input.displayName.trim()
    }

    if (input.proficiency !== undefined)
      updateData.proficiency = input.proficiency
    if (input.yearsOfExperience !== undefined)
      updateData.yearsOfExperience = input.yearsOfExperience
    if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder

    const updated = await this.repository.updateSkill(id, updateData)
    if (!updated) {
      throw AppError.skillNotFound()
    }

    return this.toSkillDto(updated)
  }

  async deleteSkill(
    principal: Principal,
    id: string
  ): Promise<{ success: true }> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const skill = await this.repository.findSkillById(id)

    if (!skill) {
      throw AppError.skillNotFound()
    }

    if (skill.candidateProfileId !== profile.id) {
      throw AppError.candidateAccessDenied(
        "Not authorized to delete this skill record"
      )
    }

    await this.repository.deleteSkill(id)
    return { success: true }
  }

  // --- Preferences Operations ---

  async getPreferences(
    principal: Principal
  ): Promise<CandidatePreferencesDto | null> {
    const profile = await this.getProfileOrThrow(principal.userId)
    const pref = await this.repository.findPreferences(profile.id)
    return pref ? this.toPreferencesDto(pref) : null
  }

  async updatePreferences(
    principal: Principal,
    input: UpdatePreferencesInput
  ): Promise<CandidatePreferencesDto> {
    const profile = await this.getProfileOrThrow(principal.userId)

    if (
      input.salaryMinimum !== undefined &&
      input.salaryMaximum !== undefined &&
      input.salaryMinimum !== null &&
      input.salaryMaximum !== null &&
      input.salaryMinimum > input.salaryMaximum
    ) {
      throw AppError.invalidCandidateState(
        "Salary minimum cannot be greater than salary maximum",
        [
          {
            field: "salaryMinimum",
            message: "Minimum salary cannot exceed maximum salary",
          },
        ]
      )
    }

    const updated = await this.repository.upsertPreferences(profile.id, {
      ...(input.desiredJobTitles !== undefined
        ? { desiredJobTitles: input.desiredJobTitles }
        : {}),
      ...(input.desiredEmploymentTypes !== undefined
        ? { desiredEmploymentTypes: input.desiredEmploymentTypes }
        : {}),
      ...(input.workLocationPreference !== undefined
        ? { workLocationPreference: input.workLocationPreference }
        : {}),
      ...(input.preferredLocations !== undefined
        ? { preferredLocations: input.preferredLocations }
        : {}),
      ...(input.salaryCurrency !== undefined
        ? { salaryCurrency: input.salaryCurrency }
        : {}),
      ...(input.salaryMinimum !== undefined
        ? { salaryMinimum: input.salaryMinimum }
        : {}),
      ...(input.salaryMaximum !== undefined
        ? { salaryMaximum: input.salaryMaximum }
        : {}),
      ...(input.relocationPreference !== undefined
        ? { relocationPreference: input.relocationPreference }
        : {}),
      ...(input.sponsorshipRequired !== undefined
        ? { sponsorshipRequired: input.sponsorshipRequired }
        : {}),
    })

    return this.toPreferencesDto(updated)
  }
}

export const candidateService = new CandidateService()
