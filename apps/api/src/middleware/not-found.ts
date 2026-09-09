import type { NotFoundHandler } from "hono"
import { ERROR_CODES } from "../shared/errors/error-codes"
import { sendError } from "../shared/responses/api-response"
import type { AppEnv } from "../shared/types/context"

export const notFound: NotFoundHandler<AppEnv> = (c) => {
  return sendError(
    c,
    ERROR_CODES.NOT_FOUND,
    `Route ${c.req.method} ${c.req.path} not found`,
    undefined,
    404
  )
}
