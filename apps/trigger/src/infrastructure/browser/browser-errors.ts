import { TaskError, type TaskErrorDetails } from "../../shared/errors"

export type BrowserErrorCode =
  | "BROWSER_LAUNCH_FAILED"
  | "BROWSER_NAVIGATION_FAILED"
  | "BROWSER_TIMEOUT"
  | "BROWSER_SESSION_EXPIRED"
  | "BROWSER_PROVIDER_ERROR"
  | "BROWSER_ACTION_FAILED"
  | "BROWSER_AUTH_REQUIRED"
  | "BROWSER_CAPTCHA_REQUIRED"
  | "BROWSER_SAFETY_VIOLATION"

export class BrowserError extends TaskError {
  public readonly browserCode: BrowserErrorCode

  constructor(options: {
    message: string
    browserCode: BrowserErrorCode
    isRetryable: boolean
    details?: TaskErrorDetails
    cause?: unknown
  }) {
    super({
      message: options.message,
      code: options.isRetryable ? "TASK_TRANSIENT_ERROR" : "TASK_DOMAIN_ERROR",
      isRetryable: options.isRetryable,
      details: {
        ...options.details,
        browserCode: options.browserCode,
      },
      cause: options.cause,
    })
    this.name = "BrowserError"
    this.browserCode = options.browserCode

    Object.setPrototypeOf(this, new.target.prototype)
  }

  static launch(
    message: string,
    details?: TaskErrorDetails,
    cause?: unknown
  ): BrowserError {
    return new BrowserError({
      message,
      browserCode: "BROWSER_LAUNCH_FAILED",
      isRetryable: true,
      details,
      cause,
    })
  }

  static navigation(
    message: string,
    details?: TaskErrorDetails,
    cause?: unknown
  ): BrowserError {
    return new BrowserError({
      message,
      browserCode: "BROWSER_NAVIGATION_FAILED",
      isRetryable: true,
      details,
      cause,
    })
  }

  static timeout(
    message: string,
    details?: TaskErrorDetails,
    cause?: unknown
  ): BrowserError {
    return new BrowserError({
      message,
      browserCode: "BROWSER_TIMEOUT",
      isRetryable: true,
      details,
      cause,
    })
  }

  static sessionExpired(
    message: string,
    details?: TaskErrorDetails,
    cause?: unknown
  ): BrowserError {
    return new BrowserError({
      message,
      browserCode: "BROWSER_SESSION_EXPIRED",
      isRetryable: true,
      details,
      cause,
    })
  }

  static provider(
    message: string,
    details?: TaskErrorDetails,
    cause?: unknown
  ): BrowserError {
    return new BrowserError({
      message,
      browserCode: "BROWSER_PROVIDER_ERROR",
      isRetryable: true,
      details,
      cause,
    })
  }

  static action(
    message: string,
    details?: TaskErrorDetails,
    cause?: unknown
  ): BrowserError {
    return new BrowserError({
      message,
      browserCode: "BROWSER_ACTION_FAILED",
      isRetryable: false,
      details,
      cause,
    })
  }

  static authRequired(
    message: string,
    details?: TaskErrorDetails,
    cause?: unknown
  ): BrowserError {
    return new BrowserError({
      message,
      browserCode: "BROWSER_AUTH_REQUIRED",
      isRetryable: false,
      details,
      cause,
    })
  }

  static captchaRequired(
    message: string,
    details?: TaskErrorDetails,
    cause?: unknown
  ): BrowserError {
    return new BrowserError({
      message,
      browserCode: "BROWSER_CAPTCHA_REQUIRED",
      isRetryable: false,
      details,
      cause,
    })
  }

  static safetyViolation(
    message: string,
    details?: TaskErrorDetails
  ): BrowserError {
    return new BrowserError({
      message,
      browserCode: "BROWSER_SAFETY_VIOLATION",
      isRetryable: false,
      details,
    })
  }
}

export function mapPlaywrightError(
  error: unknown,
  context = "browser operation"
): BrowserError {
  if (error instanceof BrowserError) {
    return error
  }

  const message = error instanceof Error ? error.message : String(error)
  const lower = message.toLowerCase()

  if (lower.includes("timeout") || lower.includes("timed out")) {
    return BrowserError.timeout(
      `Timeout during ${context}: ${message}`,
      undefined,
      error
    )
  }

  if (
    lower.includes("target closed") ||
    lower.includes("page closed") ||
    lower.includes("session closed") ||
    lower.includes("browser has been closed")
  ) {
    return BrowserError.sessionExpired(
      `Browser session terminated unexpectedly during ${context}: ${message}`,
      undefined,
      error
    )
  }

  if (
    lower.includes("net::err_") ||
    lower.includes("navigation failed") ||
    lower.includes("failed to navigate")
  ) {
    return BrowserError.navigation(
      `Navigation error during ${context}: ${message}`,
      undefined,
      error
    )
  }

  if (
    lower.includes("captcha") ||
    lower.includes("cloudflare") ||
    lower.includes("challenge")
  ) {
    return BrowserError.captchaRequired(
      `CAPTCHA/Challenge detected during ${context}`,
      undefined,
      error
    )
  }

  if (
    lower.includes("login") ||
    lower.includes("sign in") ||
    lower.includes("unauthorized")
  ) {
    return BrowserError.authRequired(
      `Authentication required during ${context}`,
      undefined,
      error
    )
  }

  return BrowserError.action(
    `Failed to execute ${context}: ${message}`,
    undefined,
    error
  )
}
