import { Hono } from "hono"
import {
  cors,
  errorHandler,
  notFound,
  principal,
  requestId,
  requestLogger,
} from "../middleware"
import type { AppEnv } from "../shared/types/context"
import { apiRouter } from "./router"

export function createApp(): Hono<AppEnv> {
  const app = new Hono<AppEnv>()

  // Global Middleware Pipeline
  // 1. Request ID & Start Time Context
  app.use("*", requestId())

  // 2. Structured Request / Response Logger
  app.use("*", requestLogger())

  // 3. Centralized CORS
  app.use("*", cors())

  // 4. Principal / Authentication Boundary
  app.use("*", principal())

  // Extension Point: Future Security Headers Middleware
  // Extension Point: Future Rate Limiting Middleware

  // Mount API router (/api/v1/...)
  app.route("/api", apiRouter)

  // Global 404 Handler
  app.notFound(notFound)

  // Global Centralized Error Handler
  app.onError(errorHandler)

  return app
}

export const app = createApp()
