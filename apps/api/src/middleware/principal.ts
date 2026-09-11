import type { MiddlewareHandler } from "hono"
import { env } from "../config/env"
import { AppError } from "../shared/errors/app-error"
import type { AppEnv, Principal } from "../shared/types/context"

export const DEFAULT_DEV_PRINCIPAL: Principal = {
  userId: "00000000-0000-0000-0000-000000000001",
  email: "dev@fulcra.local",
  name: "Fulcra Developer",
  isAnonymous: false,
}

/**
 * Principal resolution middleware.
 *
 * In local/dev/test environments, resolves the authenticated principal either from:
 * 1. Explicit `X-User-Id` request header (allows testing multi-tenant isolation), or
 * 2. Deterministic default developer principal.
 *
 * In production mode, this serves as the authentication boundary where real JWT/OAuth
 * tokens will be verified; missing credentials yield 401 Unauthorized.
 */
export function principal(): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const isDevOrTest =
      env.isDevelopment || env.isTest || env.API_ENV === "local"

    const headerUserId = c.req.header("X-User-Id")
    const headerEmail = c.req.header("X-User-Email")
    const headerName = c.req.header("X-User-Name")

    if (headerUserId) {
      const customPrincipal: Principal = {
        userId: headerUserId,
        email: headerEmail || `${headerUserId}@test.fulcra.local`,
        name: headerName || `User ${headerUserId.slice(0, 8)}`,
        isAnonymous: false,
      }
      c.set("principal", customPrincipal)
      return next()
    }

    if (isDevOrTest) {
      c.set("principal", DEFAULT_DEV_PRINCIPAL)
      return next()
    }

    // Production without authentication token
    throw AppError.unauthorized("Authentication required")
  }
}
