import { describe, expect, it, vi, beforeEach } from "vitest"
import { CandidateService } from "../../src/features/candidates/candidate.service"
import type { CandidateRepository } from "../../src/features/candidates/candidate.repository"
import type { Principal } from "../../src/shared/types/context"
import { AppError } from "../../src/shared/errors/app-error"
import { ERROR_CODES } from "../../src/shared/errors/error-codes"

describe("CandidateService Unit Tests", () => {
  let mockRepo: CandidateRepository
  let service: CandidateService

  const testPrincipal: Principal = {
    userId: "11111111-1111-1111-1111-111111111111",
    email: "test@fulcra.local",
    name: "Alex Rivera",
    isAnonymous: false,
  }

  const existingProfile = {
    id: "22222222-2222-2222-2222-222222222222",
    userId: testPrincipal.userId,
    displayName: "Alex Rivera",
    headline: "Staff Engineer",
    summary: "Distributed systems builder",
    phone: "+1 555 1234",
    city: "Seattle",
    state: "WA",
    country: "USA",
    postalCode: "98101",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  }

  beforeEach(() => {
    mockRepo = {
      ensureUser: vi.fn().mockResolvedValue(undefined),
      findProfileByUserId: vi.fn(),
      findProfileById: vi.fn(),
      createProfile: vi.fn(),
      updateProfile: vi.fn(),
      deleteProfile: vi.fn(),
      findAggregateByUserId: vi.fn(),
      listExperiences: vi.fn(),
      findExperienceById: vi.fn(),
      createExperience: vi.fn(),
      updateExperience: vi.fn(),
      deleteExperience: vi.fn(),
      listEducation: vi.fn(),
      findEducationById: vi.fn(),
      createEducation: vi.fn(),
      updateEducation: vi.fn(),
      deleteEducation: vi.fn(),
      listSkills: vi.fn(),
      findSkillById: vi.fn(),
      findSkillByNormalizedName: vi.fn(),
      createSkill: vi.fn(),
      updateSkill: vi.fn(),
      deleteSkill: vi.fn(),
      findPreferences: vi.fn(),
      upsertPreferences: vi.fn(),
    }
    service = new CandidateService(mockRepo)
  })

  describe("createProfile", () => {
    it("should prevent creating duplicate candidate profiles for the same user", async () => {
      vi.mocked(mockRepo.findProfileByUserId).mockResolvedValue(existingProfile)

      await expect(
        service.createProfile(testPrincipal, { headline: "New Headline" })
      ).rejects.toThrowError(AppError)

      try {
        await service.createProfile(testPrincipal, { headline: "New Headline" })
      } catch (err: unknown) {
        expect((err as AppError).code).toBe(
          ERROR_CODES.CANDIDATE_ALREADY_EXISTS
        )
      }
    })

    it("should ensure user exists and create profile successfully", async () => {
      vi.mocked(mockRepo.findProfileByUserId).mockResolvedValue(null)
      vi.mocked(mockRepo.createProfile).mockResolvedValue(existingProfile)

      const result = await service.createProfile(testPrincipal, {
        displayName: "Alex Rivera",
        headline: "Staff Engineer",
      })

      expect(mockRepo.ensureUser).toHaveBeenCalledWith(testPrincipal)
      expect(result.id).toBe(existingProfile.id)
      expect(result.displayName).toBe("Alex Rivera")
    })
  })

  describe("Experiences & Date Validation", () => {
    it("should reject experience when startDate is chronologically after endDate", async () => {
      vi.mocked(mockRepo.findProfileByUserId).mockResolvedValue(existingProfile)

      await expect(
        service.createExperience(testPrincipal, {
          companyName: "Acme Corp",
          title: "Senior Dev",
          startDate: "2024-05",
          endDate: "2023-01",
          isCurrent: false,
          sortOrder: 0,
        })
      ).rejects.toThrowError(AppError)

      try {
        await service.createExperience(testPrincipal, {
          companyName: "Acme Corp",
          title: "Senior Dev",
          startDate: "2024-05",
          endDate: "2023-01",
          isCurrent: false,
          sortOrder: 0,
        })
      } catch (err: unknown) {
        expect((err as AppError).code).toBe(ERROR_CODES.INVALID_CANDIDATE_STATE)
      }
    })

    it("should enforce ownership when updating experience", async () => {
      vi.mocked(mockRepo.findProfileByUserId).mockResolvedValue(existingProfile)
      // Experience belongs to another profile:
      vi.mocked(mockRepo.findExperienceById).mockResolvedValue({
        id: "exp-alien-999",
        candidateProfileId: "alien-profile-id-999",
        companyName: "Other Corp",
        title: "Engineer",
        employmentType: "full-time",
        location: null,
        startDate: "2020-01",
        endDate: null,
        isCurrent: true,
        description: null,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await expect(
        service.updateExperience(testPrincipal, "exp-alien-999", {
          companyName: "Hijacked Corp",
        })
      ).rejects.toThrowError(AppError)

      try {
        await service.updateExperience(testPrincipal, "exp-alien-999", {
          companyName: "Hijacked Corp",
        })
      } catch (err: unknown) {
        expect((err as AppError).code).toBe(ERROR_CODES.CANDIDATE_ACCESS_DENIED)
      }
    })
  })

  describe("Skills & Duplicate Prevention", () => {
    it("should normalize skill names and reject duplicates", async () => {
      vi.mocked(mockRepo.findProfileByUserId).mockResolvedValue(existingProfile)
      vi.mocked(mockRepo.findSkillByNormalizedName).mockResolvedValue({
        id: "skill-1",
        candidateProfileId: existingProfile.id,
        name: "react",
        displayName: "React",
        proficiency: "advanced",
        yearsOfExperience: 4,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await expect(
        service.createSkill(testPrincipal, {
          name: "  REACT  ",
          displayName: "React",
          sortOrder: 0,
        })
      ).rejects.toThrowError(AppError)

      try {
        await service.createSkill(testPrincipal, {
          name: "  REACT  ",
          displayName: "React",
          sortOrder: 0,
        })
      } catch (err: unknown) {
        expect((err as AppError).code).toBe(ERROR_CODES.SKILL_ALREADY_EXISTS)
      }
    })
  })

  describe("Preferences Validation", () => {
    it("should reject salary preferences when salaryMinimum exceeds salaryMaximum", async () => {
      vi.mocked(mockRepo.findProfileByUserId).mockResolvedValue(existingProfile)

      await expect(
        service.updatePreferences(testPrincipal, {
          salaryMinimum: 200000,
          salaryMaximum: 100000,
        })
      ).rejects.toThrowError(AppError)

      try {
        await service.updatePreferences(testPrincipal, {
          salaryMinimum: 200000,
          salaryMaximum: 100000,
        })
      } catch (err: unknown) {
        expect((err as AppError).code).toBe(ERROR_CODES.INVALID_CANDIDATE_STATE)
      }
    })
  })
})
