import { Hono } from "hono"
import { env } from "../../config/env"
import { sendSuccess } from "../../shared/responses/api-response"
import type { AppEnv } from "../../shared/types/context"
import type { VersionResponse } from "./version.schema"

export const versionRoute = new Hono<AppEnv>()

versionRoute.get("/", (c) => {
  const data: VersionResponse = {
    api: "v1",
    version: env.API_VERSION,
    environment: env.API_ENV,
  }

  return sendSuccess(c, data)
})
