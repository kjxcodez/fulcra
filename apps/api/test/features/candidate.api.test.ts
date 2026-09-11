/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest"
import { app } from "../../src/app/app"

describe("Candidate API Integration Tests (/api/v1/candidate)", () => {
  // Deterministic user for this suite
  const userAId = `00000000-0000-4000-8000-${Math.floor(100000000000 + Math.random() * 900000000000)}`
  const userBId = `00000000-0000-4000-8000-${Math.floor(100000000000 + Math.random() * 900000000000)}`

  const headersUserA = {
    "Content-Type": "application/json",
    "X-User-Id": userAId,
    "X-User-Email": `user-a-${Date.now()}@fulcra.local`,
    "X-User-Name": "User A Candidate",
  }

  const headersUserB = {
    "Content-Type": "application/json",
    "X-User-Id": userBId,
    "X-User-Email": `user-b-${Date.now()}@fulcra.local`,
    "X-User-Name": "User B Candidate",
  }

  let createdExpId = ""
  let createdEduId = ""
  let createdSkillId = ""

  it("should return 404 CANDIDATE_NOT_FOUND when candidate profile does not exist yet", async () => {
    const res = await app.request("/api/v1/candidate", {
      headers: headersUserA,
    })

    expect(res.status).toBe(404)
    const body = (await res.json()) as any
    expect(body.success).toBe(false)
    expect(body.error.code).toBe("CANDIDATE_NOT_FOUND")
    expect(body.meta.requestId).toBeDefined()
  })

  it("should create candidate profile via POST /api/v1/candidate", async () => {
    const res = await app.request("/api/v1/candidate", {
      method: "POST",
      headers: headersUserA,
      body: JSON.stringify({
        displayName: "User A",
        headline: "Principal Systems Architect",
        summary: "Specialist in cloud-native platforms.",
        phone: "+1 555 9876",
        location: {
          city: "Austin",
          state: "TX",
          country: "USA",
          postalCode: "78701",
        },
      }),
    })

    expect(res.status).toBe(201)
    const body = (await res.json()) as any
    expect(body.success).toBe(true)
    expect(body.data.id).toBeDefined()
    expect(body.data.userId).toBe(userAId)
    expect(body.data.displayName).toBe("User A")
    expect(body.data.location.city).toBe("Austin")
  })

  it("should reject duplicate profile creation for same user with 409 CANDIDATE_ALREADY_EXISTS", async () => {
    const res = await app.request("/api/v1/candidate", {
      method: "POST",
      headers: headersUserA,
      body: JSON.stringify({
        headline: "Duplicate Attempt",
      }),
    })

    expect(res.status).toBe(409)
    const body = (await res.json()) as any
    expect(body.success).toBe(false)
    expect(body.error.code).toBe("CANDIDATE_ALREADY_EXISTS")
  })

  it("should update profile via PATCH /api/v1/candidate", async () => {
    const res = await app.request("/api/v1/candidate", {
      method: "PATCH",
      headers: headersUserA,
      body: JSON.stringify({
        headline: "Distinguished Engineer",
      }),
    })

    expect(res.status).toBe(200)
    const body = (await res.json()) as any
    expect(body.success).toBe(true)
    expect(body.data.headline).toBe("Distinguished Engineer")
  })

  it("should manage experiences (create, update, list)", async () => {
    // 1. Create Experience
    const createRes = await app.request("/api/v1/candidate/experiences", {
      method: "POST",
      headers: headersUserA,
      body: JSON.stringify({
        companyName: "Acme Innovations",
        title: "Staff Infrastructure Engineer",
        employmentType: "full-time",
        location: "Remote - US",
        startDate: "2021-04",
        isCurrent: true,
        description: "Leading core platform initiatives.",
        sortOrder: 0,
      }),
    })

    expect(createRes.status).toBe(201)
    const createBody = (await createRes.json()) as any
    expect(createBody.success).toBe(true)
    createdExpId = createBody.data.id
    expect(createdExpId).toBeDefined()
    expect(createBody.data.companyName).toBe("Acme Innovations")
    expect(createBody.data.isCurrent).toBe(true)

    // 2. Update Experience
    const updateRes = await app.request(
      `/api/v1/candidate/experiences/${createdExpId}`,
      {
        method: "PATCH",
        headers: headersUserA,
        body: JSON.stringify({
          title: "Principal Infrastructure Engineer",
        }),
      }
    )

    expect(updateRes.status).toBe(200)
    const updateBody = (await updateRes.json()) as any
    expect(updateBody.success).toBe(true)
    expect(updateBody.data.title).toBe("Principal Infrastructure Engineer")

    // 3. List Experiences
    const listRes = await app.request("/api/v1/candidate/experiences", {
      headers: headersUserA,
    })

    expect(listRes.status).toBe(200)
    const listBody = (await listRes.json()) as any
    expect(listBody.success).toBe(true)
    expect(listBody.data.length).toBeGreaterThan(0)
    expect(listBody.data[0].id).toBe(createdExpId)
  })

  it("should manage education (create, list)", async () => {
    const createRes = await app.request("/api/v1/candidate/education", {
      method: "POST",
      headers: headersUserA,
      body: JSON.stringify({
        institution: "Stanford University",
        degree: "M.S.",
        fieldOfStudy: "Computer Science",
        startDate: "2018-09",
        endDate: "2020-06",
        isCurrent: false,
        sortOrder: 0,
      }),
    })

    expect(createRes.status).toBe(201)
    const createBody = (await createRes.json()) as any
    expect(createBody.success).toBe(true)
    createdEduId = createBody.data.id
    expect(createdEduId).toBeDefined()

    const listRes = await app.request("/api/v1/candidate/education", {
      headers: headersUserA,
    })
    expect(listRes.status).toBe(200)
    const listBody = (await listRes.json()) as any
    expect(listBody.data.length).toBeGreaterThan(0)
  })

  it("should manage skills and prevent duplicates", async () => {
    // 1. Add skill
    const createRes = await app.request("/api/v1/candidate/skills", {
      method: "POST",
      headers: headersUserA,
      body: JSON.stringify({
        name: "Go",
        displayName: "Golang",
        proficiency: "expert",
        yearsOfExperience: 6,
        sortOrder: 0,
      }),
    })

    expect(createRes.status).toBe(201)
    const createBody = (await createRes.json()) as any
    expect(createBody.success).toBe(true)
    createdSkillId = createBody.data.id
    expect(createBody.data.name).toBe("go")

    // 2. Reject duplicate skill (case-insensitive normalized)
    const dupRes = await app.request("/api/v1/candidate/skills", {
      method: "POST",
      headers: headersUserA,
      body: JSON.stringify({
        name: "  GO  ",
        displayName: "Go",
      }),
    })

    expect(dupRes.status).toBe(409)
    const dupBody = (await dupRes.json()) as any
    expect(dupBody.success).toBe(false)
    expect(dupBody.error.code).toBe("SKILL_ALREADY_EXISTS")
  })

  it("should manage preferences via GET and PATCH /api/v1/candidate/preferences", async () => {
    const patchRes = await app.request("/api/v1/candidate/preferences", {
      method: "PATCH",
      headers: headersUserA,
      body: JSON.stringify({
        desiredJobTitles: ["Principal Engineer", "Distinguished Engineer"],
        desiredEmploymentTypes: ["full-time"],
        workLocationPreference: "remote",
        preferredLocations: ["Remote - US"],
        salaryCurrency: "USD",
        salaryMinimum: 210000,
        salaryMaximum: 280000,
        relocationPreference: "no",
        sponsorshipRequired: false,
      }),
    })

    expect(patchRes.status).toBe(200)
    const patchBody = (await patchRes.json()) as any
    expect(patchBody.success).toBe(true)
    expect(patchBody.data.workLocationPreference).toBe("remote")
    expect(patchBody.data.salaryMinimum).toBe(210000)

    const getRes = await app.request("/api/v1/candidate/preferences", {
      headers: headersUserA,
    })
    expect(getRes.status).toBe(200)
    const getBody = (await getRes.json()) as any
    expect(getBody.data.workLocationPreference).toBe("remote")
  })

  it("should return full aggregate via GET /api/v1/candidate", async () => {
    const res = await app.request("/api/v1/candidate", {
      headers: headersUserA,
    })

    expect(res.status).toBe(200)
    const body = (await res.json()) as any
    expect(body.success).toBe(true)
    expect(body.data.id).toBeDefined()
    expect(body.data.userId).toBe(userAId)
    expect(body.data.profile.headline).toBe("Distinguished Engineer")
    expect(body.data.experiences.length).toBeGreaterThan(0)
    expect(body.data.education.length).toBeGreaterThan(0)
    expect(body.data.skills.length).toBeGreaterThan(0)
    expect(body.data.preferences).toBeDefined()
    expect(body.data.preferences.workLocationPreference).toBe("remote")
  })

  it("should enforce multi-tenant ownership boundaries (User B cannot access User A resources)", async () => {
    // 1. User B has no profile yet -> GET candidate returns 404
    const resCandidate = await app.request("/api/v1/candidate", {
      headers: headersUserB,
    })
    expect(resCandidate.status).toBe(404)

    // 2. User B tries to delete User A's experience
    const resDeleteExp = await app.request(
      `/api/v1/candidate/experiences/${createdExpId}`,
      {
        method: "DELETE",
        headers: headersUserB,
      }
    )
    // Returns 404 CANDIDATE_NOT_FOUND (since User B has no profile)
    expect(resDeleteExp.status).toBe(404)

    // 3. User B creates their own profile
    await app.request("/api/v1/candidate", {
      method: "POST",
      headers: headersUserB,
      body: JSON.stringify({
        displayName: "User B",
        headline: "Frontend Specialist",
      }),
    })

    // 4. User B now tries to delete User A's experience with an existing profile
    const resDeleteWithProfile = await app.request(
      `/api/v1/candidate/experiences/${createdExpId}`,
      {
        method: "DELETE",
        headers: headersUserB,
      }
    )
    expect(resDeleteWithProfile.status).toBe(403)
    const deniedBody = (await resDeleteWithProfile.json()) as any
    expect(deniedBody.error.code).toBe("CANDIDATE_ACCESS_DENIED")
  })

  it("should return 400 VALIDATION_ERROR on malformed parameters or body", async () => {
    // Malformed UUID in route parameter
    const resParam = await app.request(
      "/api/v1/candidate/experiences/not-a-valid-uuid",
      {
        method: "DELETE",
        headers: headersUserA,
      }
    )
    expect(resParam.status).toBe(400)
    const bodyParam = (await resParam.json()) as any
    expect(bodyParam.error.code).toBe("VALIDATION_ERROR")
    expect(bodyParam.error.details[0].field).toBe("id")

    // Invalid date in experience body
    const resDate = await app.request("/api/v1/candidate/experiences", {
      method: "POST",
      headers: headersUserA,
      body: JSON.stringify({
        companyName: "Invalid Date Corp",
        title: "Engineer",
        startDate: "invalid-date",
      }),
    })
    expect(resDate.status).toBe(400)
    const bodyDate = (await resDate.json()) as any
    expect(bodyDate.error.code).toBe("VALIDATION_ERROR")
    expect(bodyDate.error.details[0].field).toBe("startDate")
  })

  it("should delete child resources and cascade delete candidate profile", async () => {
    // Delete individual skill
    const resSkill = await app.request(
      `/api/v1/candidate/skills/${createdSkillId}`,
      {
        method: "DELETE",
        headers: headersUserA,
      }
    )
    expect(resSkill.status).toBe(200)

    // Delete education
    const resEdu = await app.request(
      `/api/v1/candidate/education/${createdEduId}`,
      {
        method: "DELETE",
        headers: headersUserA,
      }
    )
    expect(resEdu.status).toBe(200)

    // Delete candidate profile root
    const resProfile = await app.request("/api/v1/candidate", {
      method: "DELETE",
      headers: headersUserA,
    })
    expect(resProfile.status).toBe(200)

    // Next GET returns 404
    const resCheck = await app.request("/api/v1/candidate", {
      headers: headersUserA,
    })
    expect(resCheck.status).toBe(404)
  })
})
