import { Hono } from "hono"
import { sendSuccess } from "../../shared/responses/api-response"
import type { AppEnv } from "../../shared/types/context"
import { validate } from "../../shared/validation/validate"
import { healthQuerySchema, type HealthResponse } from "./health.schema"

export const healthRoute = new Hono<AppEnv>()

healthRoute.get("/", validate("query", healthQuerySchema), (c) => {
  const { echo } = c.req.valid("query")

  const responseData: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    ...(echo ? { echo } : {}),
  }

  return sendSuccess(c, responseData)
})
