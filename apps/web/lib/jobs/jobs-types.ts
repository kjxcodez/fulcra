export type JobSource = "greenhouse" | "lever" | "workday" | "direct"

export type JobWorkType = "remote" | "hybrid" | "on-site"

export type JobEmploymentType = "full-time" | "contract" | "part-time"

export type JobSeniority =
  "junior" | "mid" | "senior" | "lead" | "staff" | "principal"

export interface JobSalary {
  currency: string
  min?: number
  max?: number
  interval: "year" | "month" | "hour"
}

export interface JobLocation {
  city?: string
  state?: string
  country?: string
  workType: JobWorkType
}

export interface Job {
  id: string
  slug: string
  title: string
  company: string
  companyLogoText?: string
  location: JobLocation
  employmentType: JobEmploymentType
  seniority: JobSeniority
  salary?: JobSalary
  source: JobSource
  sourceUrl: string
  postedAt: string
  updatedAt: string
  overview: string
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  benefits: string[]
  tags: string[]
}

export interface JobFilters {
  query?: string
  workType?: JobWorkType | "all"
  seniority?: JobSeniority | "all"
  source?: JobSource | "all"
  sortBy?: "recent" | "salary" | "title"
}

export interface JobSearchResult {
  jobs: Job[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
