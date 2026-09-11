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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    const data = (await response.json()) as ApiResponse<T>
    return data
  } catch (err) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message:
          err instanceof Error ? err.message : "Failed to connect to API",
      },
      meta: {
        requestId: "req_client_error",
        timestamp: new Date().toISOString(),
      },
    }
  }
}

// --- Candidate Domain Types ---

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
  id: string
  userId: string
  profile: {
    displayName?: string | null
    headline?: string | null
    summary?: string | null
    phone?: string | null
    location: CandidateLocation
  }
  experiences: CandidateExperienceDto[]
  education: CandidateEducationDto[]
  skills: CandidateSkillDto[]
  preferences: CandidatePreferencesDto | null
  createdAt: string
  updatedAt: string
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

// --- Candidate API Client ---

export const candidateApi = {
  getCandidate: () => apiFetch<CandidateAggregateDto>("/api/v1/candidate"),

  createProfile: (input: CreateCandidateProfileInput) =>
    apiFetch<CandidateProfileDto>("/api/v1/candidate", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateProfile: (input: UpdateCandidateProfileInput) =>
    apiFetch<CandidateProfileDto>("/api/v1/candidate", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  deleteProfile: () =>
    apiFetch<{ success: true }>("/api/v1/candidate", {
      method: "DELETE",
    }),

  listExperiences: () =>
    apiFetch<CandidateExperienceDto[]>("/api/v1/candidate/experiences"),

  createExperience: (input: CreateExperienceInput) =>
    apiFetch<CandidateExperienceDto>("/api/v1/candidate/experiences", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateExperience: (id: string, input: UpdateExperienceInput) =>
    apiFetch<CandidateExperienceDto>(`/api/v1/candidate/experiences/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  deleteExperience: (id: string) =>
    apiFetch<{ success: true }>(`/api/v1/candidate/experiences/${id}`, {
      method: "DELETE",
    }),

  listEducation: () =>
    apiFetch<CandidateEducationDto[]>("/api/v1/candidate/education"),

  createEducation: (input: CreateEducationInput) =>
    apiFetch<CandidateEducationDto>("/api/v1/candidate/education", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateEducation: (id: string, input: UpdateEducationInput) =>
    apiFetch<CandidateEducationDto>(`/api/v1/candidate/education/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  deleteEducation: (id: string) =>
    apiFetch<{ success: true }>(`/api/v1/candidate/education/${id}`, {
      method: "DELETE",
    }),

  listSkills: () => apiFetch<CandidateSkillDto[]>("/api/v1/candidate/skills"),

  createSkill: (input: CreateSkillInput) =>
    apiFetch<CandidateSkillDto>("/api/v1/candidate/skills", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateSkill: (id: string, input: UpdateSkillInput) =>
    apiFetch<CandidateSkillDto>(`/api/v1/candidate/skills/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),

  deleteSkill: (id: string) =>
    apiFetch<{ success: true }>(`/api/v1/candidate/skills/${id}`, {
      method: "DELETE",
    }),

  getPreferences: () =>
    apiFetch<CandidatePreferencesDto | null>("/api/v1/candidate/preferences"),

  updatePreferences: (input: UpdatePreferencesInput) =>
    apiFetch<CandidatePreferencesDto>("/api/v1/candidate/preferences", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
}
