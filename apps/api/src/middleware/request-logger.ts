import type { MiddlewareHandler } from "hono"
import { logger } from "../infrastructure/logger"
import type { AppEnv } from "../shared/types/context"

export function requestLogger(): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const start = c.get("startTime") || Date.now()
    const reqId = c.get("requestId") || "req_unknown"
    const method = c.req.method
    const path = c.req.path

    await next()

    const durationMs = Date.now() - start
    const status = c.res.status

    const context = {
      requestId: reqId,
      method,
      path,
      status,
      durationMs,
    }

    if (status >= 500) {
      logger.error(
        `HTTP ${method} ${path} ${status} (${durationMs}ms)`,
        context
      )
    } else if (status >= 400) {
      logger.warn(`HTTP ${method} ${path} ${status} (${durationMs}ms)`, context)
    } else {
      logger.info(`HTTP ${method} ${path} ${status} (${durationMs}ms)`, context)
    }
  }
}
