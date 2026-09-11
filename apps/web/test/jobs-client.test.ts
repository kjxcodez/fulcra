import { describe, expect, it } from "vitest"
import { jobsClient } from "../lib/jobs/jobs-client"

describe("JobsClient Adapter Boundary", () => {
  it("should return default list of jobs with pagination", async () => {
    const res = await jobsClient.list({}, 1, 4)
    expect(res.jobs.length).toBeLessThanOrEqual(4)
    expect(res.total).toBeGreaterThan(0)
    expect(res.page).toBe(1)
  })

  it("should filter jobs by text search query across title, company, or tags", async () => {
    const res = await jobsClient.list({ query: "Vela" })
    expect(res.jobs.length).toBe(1)
    expect(res.jobs[0].company).toBe("Vela Systems")

    const resTags = await jobsClient.list({ query: "PostgreSQL" })
    expect(resTags.jobs.length).toBeGreaterThan(0)
  })

  it("should filter jobs by work type", async () => {
    const res = await jobsClient.list({ workType: "remote" })
    expect(res.jobs.every((j) => j.location.workType === "remote")).toBe(true)
  })

  it("should filter jobs by seniority level", async () => {
    const res = await jobsClient.list({ seniority: "staff" })
    expect(res.jobs.every((j) => j.seniority === "staff")).toBe(true)
  })

  it("should find job by ID or slug", async () => {
    const job = await jobsClient.getById("job_vela_backend_sr")
    expect(job).not.toBeNull()
    expect(job?.slug).toBe("senior-backend-engineer-vela-systems")

    const bySlug = await jobsClient.getById(
      "senior-backend-engineer-vela-systems"
    )
    expect(bySlug?.id).toBe("job_vela_backend_sr")
  })

  it("should return null for non-existent job ID", async () => {
    const notFound = await jobsClient.getById("non_existent_id")
    expect(notFound).toBeNull()
  })

  it("should sort jobs by salary descending", async () => {
    const res = await jobsClient.list({ sortBy: "salary" })
    for (let i = 0; i < res.jobs.length - 1; i++) {
      const currentMax = res.jobs[i].salary?.max || 0
      const nextMax = res.jobs[i + 1].salary?.max || 0
      expect(currentMax).toBeGreaterThanOrEqual(nextMax)
    }
  })
})
