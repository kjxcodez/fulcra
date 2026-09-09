import type { ErrorHandler } from "hono"
import { HTTPException } from "hono/http-exception"
import type { ContentfulStatusCode } from "hono/utils/http-status"
import { ZodError } from "zod"
import { logger } from "../infrastructure/logger"
import { AppError } from "../shared/errors/app-error"
import { ERROR_CODES, type ErrorCode } from "../shared/errors/error-codes"
import { sendError } from "../shared/responses/api-response"
import type { AppEnv } from "../shared/types/context"
import { formatZodIssues } from "../shared/validation/validate"

function mapHttpStatusToErrorCode(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ERROR_CODES.BAD_REQUEST
    case 401:
      return ERROR_CODES.UNAUTHORIZED
    case 403:
      return ERROR_CODES.FORBIDDEN
    case 404:
      return ERROR_CODES.NOT_FOUND
    case 405:
      return ERROR_CODES.METHOD_NOT_ALLOWED
    case 409:
      return ERROR_CODES.CONFLICT
    case 422:
      return ERROR_CODES.VALIDATION_ERROR
    case 429:
      return ERROR_CODES.RATE_LIMITED
    case 503:
      return ERROR_CODES.SERVICE_UNAVAILABLE
    default:
      return ERROR_CODES.INTERNAL_ERROR
  }
}

export const errorHandler: ErrorHandler<AppEnv> = (err, c) => {
  const requestId = c.get("requestId") || "req_unknown"

  // 1. AppError (our custom application error abstraction)
  if (err instanceof AppError) {
    logger.warn(`AppError [${err.code}]: ${err.message}`, {
      requestId,
      code: err.code,
      status: err.status,
      details: err.details,
      cause: err.cause,
    })

    return sendError(
      c,
      err.code,
      err.message,
      err.details,
      err.status as ContentfulStatusCode
    )
  }

  // 2. Direct ZodError
  if (err instanceof ZodError) {
    const details = formatZodIssues(err)
    logger.warn(`ValidationError: ${err.message}`, {
      requestId,
      details,
    })

    return sendError(
      c,
      ERROR_CODES.VALIDATION_ERROR,
      "Request validation failed",
      details,
      400
    )
  }

  // 3. Hono HTTPException
  if (err instanceof HTTPException) {
    const code = mapHttpStatusToErrorCode(err.status)
    logger.warn(`HTTPException [${err.status}]: ${err.message}`, {
      requestId,
      status: err.status,
    })

    return sendError(
      c,
      code,
      err.message,
      undefined,
      err.status as ContentfulStatusCode
    )
  }

  // 4. Unhandled / native Error (prevent stack trace leaks, return 500 INTERNAL_ERROR)
  logger.error(`UnhandledException: ${err.message}`, {
    requestId,
    name: err.name,
    stack: err.stack,
  })

  return sendError(
    c,
    ERROR_CODES.INTERNAL_ERROR,
    "An unexpected error occurred. Please try again later.",
    undefined,
    500
  )
}
