import type { MiddlewareHandler } from "hono"
import type { AppEnv } from "../shared/types/context"

function isValidRequestId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,128}$/.test(id)
}

export function requestId(): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const incomingHeader = c.req.header("x-request-id")
    const id =
      incomingHeader && isValidRequestId(incomingHeader)
        ? incomingHeader
        : `req_${crypto.randomUUID()}`

    c.set("requestId", id)
    c.set("startTime", Date.now())

    c.header("X-Request-ID", id)

    await next()
  }
}
