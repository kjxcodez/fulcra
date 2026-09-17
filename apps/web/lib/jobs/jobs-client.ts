import { JOB_FIXTURES } from "./jobs-fixtures"
import type { Job, JobFilters, JobSearchResult } from "./jobs-types"

export class JobsClient {
  private fixtures: Job[] = [...JOB_FIXTURES]

  async list(
    filters: JobFilters = {},
    page = 1,
    pageSize = 10
  ): Promise<JobSearchResult> {
    let filtered = [...this.fixtures]

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim()
      filtered = filtered.filter((j) => {
        const titleMatch = j.title.toLowerCase().includes(q)
        const compMatch = j.company.toLowerCase().includes(q)
        const descMatch = j.overview.toLowerCase().includes(q)
        const tagMatch = j.tags.some((t) => t.toLowerCase().includes(q))
        return titleMatch || compMatch || descMatch || tagMatch
      })
    }

    if (filters.workType && filters.workType !== "all") {
      filtered = filtered.filter(
        (j) => j.location.workType === filters.workType
      )
    }

    if (filters.seniority && filters.seniority !== "all") {
      filtered = filtered.filter((j) => j.seniority === filters.seniority)
    }

    if (filters.source && filters.source !== "all") {
      filtered = filtered.filter((j) => j.source === filters.source)
    }

    if (filters.minSalary && filters.minSalary > 0) {
      filtered = filtered.filter(
        (j) => (j.salary?.max || j.salary?.min || 0) >= filters.minSalary!
      )
    }

    if (filters.sortBy === "salary") {
      filtered.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0))
    } else if (filters.sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else {
      // Default: recent
      filtered.sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      )
    }

    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize) || 1
    const safePage = Math.max(1, Math.min(page, totalPages))
    const startIdx = (safePage - 1) * pageSize
    const paginated = filtered.slice(startIdx, startIdx + pageSize)

    return {
      jobs: paginated,
      total,
      page: safePage,
      pageSize,
      totalPages,
    }
  }

  async getById(idOrSlug: string): Promise<Job | null> {
    const found = this.fixtures.find(
      (j) => j.id === idOrSlug || j.slug === idOrSlug
    )
    return found ? { ...found } : null
  }

  async getFeatured(limit = 3): Promise<Job[]> {
    return this.fixtures.slice(0, limit)
  }
}

export const jobsClient = new JobsClient()
