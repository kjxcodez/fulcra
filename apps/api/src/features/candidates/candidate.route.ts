import { Hono } from "hono"
import { sendSuccess } from "../../shared/responses/api-response"
import type { AppEnv } from "../../shared/types/context"
import { validate } from "../../shared/validation/validate"
import {
  createCandidateProfileSchema,
  createEducationSchema,
  createExperienceSchema,
  createSkillSchema,
  updateCandidateProfileSchema,
  updateEducationSchema,
  updateExperienceSchema,
  updatePreferencesSchema,
  updateSkillSchema,
  uuidParamSchema,
} from "./candidate.schema"
import { candidateService } from "./candidate.service"

export const candidateRoute = new Hono<AppEnv>()

// Candidate Profile & Aggregate Root
candidateRoute.get("/", async (c) => {
  const principal = c.get("principal")
  const candidate = await candidateService.getCandidate(principal)
  return sendSuccess(c, candidate)
})

candidateRoute.post(
  "/",
  validate("json", createCandidateProfileSchema),
  async (c) => {
    const principal = c.get("principal")
    const body = c.req.valid("json")
    const created = await candidateService.createProfile(principal, body)
    return sendSuccess(c, created, 201)
  }
)

candidateRoute.patch(
  "/",
  validate("json", updateCandidateProfileSchema),
  async (c) => {
    const principal = c.get("principal")
    const body = c.req.valid("json")
    const updated = await candidateService.updateProfile(principal, body)
    return sendSuccess(c, updated)
  }
)

candidateRoute.delete("/", async (c) => {
  const principal = c.get("principal")
  const result = await candidateService.deleteProfile(principal)
  return sendSuccess(c, result)
})

// Experiences
candidateRoute.get("/experiences", async (c) => {
  const principal = c.get("principal")
  const experiences = await candidateService.listExperiences(principal)
  return sendSuccess(c, experiences)
})

candidateRoute.post(
  "/experiences",
  validate("json", createExperienceSchema),
  async (c) => {
    const principal = c.get("principal")
    const body = c.req.valid("json")
    const created = await candidateService.createExperience(principal, body)
    return sendSuccess(c, created, 201)
  }
)

candidateRoute.patch(
  "/experiences/:id",
  validate("param", uuidParamSchema),
  validate("json", updateExperienceSchema),
  async (c) => {
    const principal = c.get("principal")
    const { id } = c.req.valid("param")
    const body = c.req.valid("json")
    const updated = await candidateService.updateExperience(principal, id, body)
    return sendSuccess(c, updated)
  }
)

candidateRoute.delete(
  "/experiences/:id",
  validate("param", uuidParamSchema),
  async (c) => {
    const principal = c.get("principal")
    const { id } = c.req.valid("param")
    const result = await candidateService.deleteExperience(principal, id)
    return sendSuccess(c, result)
  }
)

// Education
candidateRoute.get("/education", async (c) => {
  const principal = c.get("principal")
  const education = await candidateService.listEducation(principal)
  return sendSuccess(c, education)
})

candidateRoute.post(
  "/education",
  validate("json", createEducationSchema),
  async (c) => {
    const principal = c.get("principal")
    const body = c.req.valid("json")
    const created = await candidateService.createEducation(principal, body)
    return sendSuccess(c, created, 201)
  }
)

candidateRoute.patch(
  "/education/:id",
  validate("param", uuidParamSchema),
  validate("json", updateEducationSchema),
  async (c) => {
    const principal = c.get("principal")
    const { id } = c.req.valid("param")
    const body = c.req.valid("json")
    const updated = await candidateService.updateEducation(principal, id, body)
    return sendSuccess(c, updated)
  }
)

candidateRoute.delete(
  "/education/:id",
  validate("param", uuidParamSchema),
  async (c) => {
    const principal = c.get("principal")
    const { id } = c.req.valid("param")
    const result = await candidateService.deleteEducation(principal, id)
    return sendSuccess(c, result)
  }
)

// Skills
candidateRoute.get("/skills", async (c) => {
  const principal = c.get("principal")
  const skills = await candidateService.listSkills(principal)
  return sendSuccess(c, skills)
})

candidateRoute.post(
  "/skills",
  validate("json", createSkillSchema),
  async (c) => {
    const principal = c.get("principal")
    const body = c.req.valid("json")
    const created = await candidateService.createSkill(principal, body)
    return sendSuccess(c, created, 201)
  }
)

candidateRoute.patch(
  "/skills/:id",
  validate("param", uuidParamSchema),
  validate("json", updateSkillSchema),
  async (c) => {
    const principal = c.get("principal")
    const { id } = c.req.valid("param")
    const body = c.req.valid("json")
    const updated = await candidateService.updateSkill(principal, id, body)
    return sendSuccess(c, updated)
  }
)

candidateRoute.delete(
  "/skills/:id",
  validate("param", uuidParamSchema),
  async (c) => {
    const principal = c.get("principal")
    const { id } = c.req.valid("param")
    const result = await candidateService.deleteSkill(principal, id)
    return sendSuccess(c, result)
  }
)

// Preferences
candidateRoute.get("/preferences", async (c) => {
  const principal = c.get("principal")
  const preferences = await candidateService.getPreferences(principal)
  return sendSuccess(c, preferences)
})

candidateRoute.patch(
  "/preferences",
  validate("json", updatePreferencesSchema),
  async (c) => {
    const principal = c.get("principal")
    const body = c.req.valid("json")
    const updated = await candidateService.updatePreferences(principal, body)
    return sendSuccess(c, updated)
  }
)
