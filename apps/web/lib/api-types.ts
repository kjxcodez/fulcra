export interface ApiResponseMeta {
  requestId: string
  timestamp: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages?: number
  }
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta: ApiResponseMeta
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  meta: ApiResponseMeta
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface CandidateLocation {
  city?: string | null
  state?: string | null
  country?: string | null
  postalCode?: string | null
}

export interface CandidateProfileDto {
  id: string
  userId: string
  displayName?: string | null
  headline?: string | null
  summary?: string | null
  phone?: string | null
  location: CandidateLocation
  createdAt: string
  updatedAt: string
}

export interface CandidateExperienceDto {
  id: string
  candidateProfileId: string
  companyName: string
  title: string
  employmentType?: string | null
  location?: string | null
  startDate: string
  endDate?: string | null
  isCurrent: boolean
  description?: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CandidateEducationDto {
  id: string
  candidateProfileId: string
  institution: string
  degree?: string | null
  fieldOfStudy?: string | null
  startDate?: string | null
  endDate?: string | null
  isCurrent: boolean
  description?: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CandidateSkillDto {
  id: string
  candidateProfileId: string
  name: string
  displayName: string
  proficiency?: string | null
  yearsOfExperience?: number | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CandidatePreferencesDto {
  id: string
  candidateProfileId: string
  desiredJobTitles: string[]
  desiredEmploymentTypes: string[]
  workLocationPreference: string
  preferredLocations: string[]
  salaryCurrency: string
  salaryMinimum?: number | null
  salaryMaximum?: number | null
  relocationPreference: string
  sponsorshipRequired: boolean
  createdAt: string
  updatedAt: string
}

export interface CandidateAggregateDto {
  profile: CandidateProfileDto
  experiences: CandidateExperienceDto[]
  education: CandidateEducationDto[]
  skills: CandidateSkillDto[]
  preferences: CandidatePreferencesDto | null
}

export interface CreateCandidateProfileInput {
  displayName?: string | null
  headline?: string | null
  summary?: string | null
  phone?: string | null
  location?: CandidateLocation | null
}

export type UpdateCandidateProfileInput = CreateCandidateProfileInput

export interface CreateExperienceInput {
  companyName: string
  title: string
  employmentType?: string | null
  location?: string | null
  startDate: string
  endDate?: string | null
  isCurrent?: boolean
  description?: string | null
  sortOrder?: number
}

export type UpdateExperienceInput = Partial<CreateExperienceInput>

export interface CreateEducationInput {
  institution: string
  degree?: string | null
  fieldOfStudy?: string | null
  startDate?: string | null
  endDate?: string | null
  isCurrent?: boolean
  description?: string | null
  sortOrder?: number
}

export type UpdateEducationInput = Partial<CreateEducationInput>

export interface CreateSkillInput {
  name: string
  displayName?: string
  proficiency?: "beginner" | "intermediate" | "advanced" | "expert" | null
  yearsOfExperience?: number | null
  sortOrder?: number
}

export type UpdateSkillInput = Partial<CreateSkillInput>

export interface UpdatePreferencesInput {
  desiredJobTitles?: string[]
  desiredEmploymentTypes?: string[]
  workLocationPreference?: "remote" | "hybrid" | "on-site" | "any"
  preferredLocations?: string[]
  salaryCurrency?: string
  salaryMinimum?: number | null
  salaryMaximum?: number | null
  relocationPreference?: "yes" | "no" | "negotiable"
  sponsorshipRequired?: boolean
}
