import type {
  ApiResponse,
  CandidateAggregateDto,
  CandidateProfileDto,
  CreateCandidateProfileInput,
  UpdateCandidateProfileInput,
  CandidateExperienceDto,
  CreateExperienceInput,
  UpdateExperienceInput,
  CandidateEducationDto,
  CreateEducationInput,
  UpdateEducationInput,
  CandidateSkillDto,
  CreateSkillInput,
  UpdateSkillInput,
  CandidatePreferencesDto,
  UpdatePreferencesInput,
} from "./api-types"

export * from "./api-types"

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // In browser, default to same-origin relative path through Next.js rewrites
    return process.env.NEXT_PUBLIC_API_URL || ""
  }
  // Server-side rendering fallback
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000"
  )
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl()
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`

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
