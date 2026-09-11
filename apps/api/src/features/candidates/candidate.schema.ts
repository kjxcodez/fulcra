import { z } from "zod"

const dateStringRegex = /^\d{4}(-\d{2})?(-\d{2})?$/

export const locationSchema = z.object({
  city: z.string().trim().max(100).optional().nullable(),
  state: z.string().trim().max(100).optional().nullable(),
  country: z.string().trim().max(100).optional().nullable(),
  postalCode: z.string().trim().max(20).optional().nullable(),
})

export const createCandidateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(255).optional().nullable(),
  headline: z.string().trim().max(255).optional().nullable(),
  summary: z.string().trim().max(5000).optional().nullable(),
  phone: z.string().trim().max(50).optional().nullable(),
  location: locationSchema.optional().nullable(),
})

export const updateCandidateProfileSchema = createCandidateProfileSchema

export const createExperienceSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(255),
  title: z.string().trim().min(1, "Title is required").max(255),
  employmentType: z
    .enum(["full-time", "part-time", "contract", "internship", "freelance"])
    .optional()
    .nullable(),
  location: z.string().trim().max(255).optional().nullable(),
  startDate: z
    .string()
    .regex(
      dateStringRegex,
      "Start date must be in YYYY, YYYY-MM, or YYYY-MM-DD format"
    ),
  endDate: z
    .string()
    .regex(
      dateStringRegex,
      "End date must be in YYYY, YYYY-MM, or YYYY-MM-DD format"
    )
    .optional()
    .nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().trim().max(5000).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
})

export const updateExperienceSchema = createExperienceSchema.partial()

export const createEducationSchema = z.object({
  institution: z.string().trim().min(1, "Institution is required").max(255),
  degree: z.string().trim().max(255).optional().nullable(),
  fieldOfStudy: z.string().trim().max(255).optional().nullable(),
  startDate: z
    .string()
    .regex(
      dateStringRegex,
      "Start date must be in YYYY, YYYY-MM, or YYYY-MM-DD format"
    )
    .optional()
    .nullable(),
  endDate: z
    .string()
    .regex(
      dateStringRegex,
      "End date must be in YYYY, YYYY-MM, or YYYY-MM-DD format"
    )
    .optional()
    .nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().trim().max(5000).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
})

export const updateEducationSchema = createEducationSchema.partial()

export const createSkillSchema = z.object({
  name: z.string().trim().min(1, "Skill name is required").max(100),
  displayName: z.string().trim().max(100).optional(),
  proficiency: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .optional()
    .nullable(),
  yearsOfExperience: z.number().int().min(0).max(100).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
})

export const updateSkillSchema = createSkillSchema.partial()

export const updatePreferencesSchema = z.object({
  desiredJobTitles: z
    .array(z.string().trim().min(1).max(100))
    .max(20)
    .optional(),
  desiredEmploymentTypes: z
    .array(z.string().trim().min(1).max(50))
    .max(10)
    .optional(),
  workLocationPreference: z
    .enum(["remote", "hybrid", "on-site", "any"])
    .optional(),
  preferredLocations: z
    .array(z.string().trim().min(1).max(100))
    .max(20)
    .optional(),
  salaryCurrency: z.string().trim().min(1).max(10).optional(),
  salaryMinimum: z.number().int().min(0).optional().nullable(),
  salaryMaximum: z.number().int().min(0).optional().nullable(),
  relocationPreference: z.enum(["yes", "no", "negotiable"]).optional(),
  sponsorshipRequired: z.boolean().optional(),
})

export const uuidParamSchema = z.object({
  id: z.string().uuid("Invalid resource identifier (must be a valid UUID)"),
})

export type CreateCandidateProfileInput = z.infer<
  typeof createCandidateProfileSchema
>
export type UpdateCandidateProfileInput = z.infer<
  typeof updateCandidateProfileSchema
>
export type CreateExperienceInput = z.infer<typeof createExperienceSchema>
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>
export type CreateEducationInput = z.infer<typeof createEducationSchema>
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>
export type CreateSkillInput = z.infer<typeof createSkillSchema>
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>
export type UuidParam = z.infer<typeof uuidParamSchema>
