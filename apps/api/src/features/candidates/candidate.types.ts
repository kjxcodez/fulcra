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
