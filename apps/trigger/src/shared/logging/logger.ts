import { logger as triggerLogger } from "@trigger.dev/sdk/v3"

export interface TaskLogContext {
  taskId?: string
  runId?: string
  requestId?: string
  durationMs?: number
  status?: "pending" | "running" | "completed" | "failed" | "retrying"
  errorCode?: string
  [key: string]: unknown
}

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /api[-_]?key/i,
  /auth/i,
  /credential/i,
  /cookie/i,
  /postgres/i,
  /database[-_]?url/i,
  /resume/i,
]

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value

  if (typeof value === "string") {
    // Redact postgres connection strings
    if (value.startsWith("postgres://") || value.startsWith("postgresql://")) {
      return "[REDACTED_DATABASE_URL]"
    }
    // Redact trigger keys
    if (value.startsWith("tr_dev_") || value.startsWith("tr_prod_")) {
      return "[REDACTED_TRIGGER_KEY]"
    }
    return value
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue)
  }

  if (typeof value === "object") {
    const sanitized: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(k))) {
        sanitized[k] = "[REDACTED]"
      } else {
        sanitized[k] = sanitizeValue(v)
      }
    }
    return sanitized
  }

  return value
}

export const taskLogger = {
  info(message: string, context?: TaskLogContext): void {
    const sanitizedContext = context
      ? (sanitizeValue(context) as TaskLogContext)
      : undefined
    try {
      triggerLogger.info(message, sanitizedContext)
    } catch {
      console.log(
        `[INFO] ${message}`,
        sanitizedContext ? JSON.stringify(sanitizedContext) : ""
      )
    }
  },

  warn(message: string, context?: TaskLogContext): void {
    const sanitizedContext = context
      ? (sanitizeValue(context) as TaskLogContext)
      : undefined
    try {
      triggerLogger.warn(message, sanitizedContext)
    } catch {
      console.warn(
        `[WARN] ${message}`,
        sanitizedContext ? JSON.stringify(sanitizedContext) : ""
      )
    }
  },

  error(message: string, context?: TaskLogContext): void {
    const sanitizedContext = context
      ? (sanitizeValue(context) as TaskLogContext)
      : undefined
    try {
      triggerLogger.error(message, sanitizedContext)
    } catch {
      console.error(
        `[ERROR] ${message}`,
        sanitizedContext ? JSON.stringify(sanitizedContext) : ""
      )
    }
  },

  debug(message: string, context?: TaskLogContext): void {
    const sanitizedContext = context
      ? (sanitizeValue(context) as TaskLogContext)
      : undefined
    try {
      triggerLogger.debug(message, sanitizedContext)
    } catch {
      console.debug(
        `[DEBUG] ${message}`,
        sanitizedContext ? JSON.stringify(sanitizedContext) : ""
      )
    }
  },
}
