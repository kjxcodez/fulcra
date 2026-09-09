import { ERROR_CODES, type ErrorCode } from "./error-codes"

export interface AppErrorOptions {
  code: ErrorCode
  status: number
  message: string
  details?: unknown
  cause?: Error
}

export class AppError extends Error {
  readonly code: ErrorCode
  readonly status: number
  readonly details?: unknown
  override readonly cause?: Error

  constructor(options: AppErrorOptions) {
    super(options.message)
    this.name = "AppError"
    this.code = options.code
    this.status = options.status
    this.details = options.details
    this.cause = options.cause

    // Capture stack trace if available
    const ErrorWithCapture = Error as unknown as {
      captureStackTrace?: (target: object, constructor: unknown) => void
    }
    if (typeof ErrorWithCapture.captureStackTrace === "function") {
      ErrorWithCapture.captureStackTrace(this, AppError)
    }
  }

  static validation(
    message = "Request validation failed",
    details?: unknown
  ): AppError {
    return new AppError({
      code: ERROR_CODES.VALIDATION_ERROR,
      status: 400,
      message,
      details,
    })
  }

  static badRequest(message = "Bad request", details?: unknown): AppError {
    return new AppError({
      code: ERROR_CODES.BAD_REQUEST,
      status: 400,
      message,
      details,
    })
  }

  static unauthorized(message = "Unauthorized"): AppError {
    return new AppError({
      code: ERROR_CODES.UNAUTHORIZED,
      status: 401,
      message,
    })
  }

  static forbidden(message = "Forbidden"): AppError {
    return new AppError({
      code: ERROR_CODES.FORBIDDEN,
      status: 403,
      message,
    })
  }

  static notFound(message = "Resource not found"): AppError {
    return new AppError({
      code: ERROR_CODES.NOT_FOUND,
      status: 404,
      message,
    })
  }

  static conflict(message = "Conflict", details?: unknown): AppError {
    return new AppError({
      code: ERROR_CODES.CONFLICT,
      status: 409,
      message,
      details,
    })
  }

  static rateLimited(
    message = "Too many requests. Please try again later."
  ): AppError {
    return new AppError({
      code: ERROR_CODES.RATE_LIMITED,
      status: 429,
      message,
    })
  }

  static internal(
    message = "An unexpected error occurred",
    cause?: Error
  ): AppError {
    return new AppError({
      code: ERROR_CODES.INTERNAL_ERROR,
      status: 500,
      message,
      cause,
    })
  }

  static serviceUnavailable(message = "Service unavailable"): AppError {
    return new AppError({
      code: ERROR_CODES.SERVICE_UNAVAILABLE,
      status: 503,
      message,
    })
  }
}
