import { env } from "../../config/env"

export type LogLevel = "debug" | "info" | "warn" | "error"

export type LogContext = Record<string, unknown>

export interface Logger {
  debug(message: string, context?: LogContext): void
  info(message: string, context?: LogContext): void
  warn(message: string, context?: LogContext): void
  error(message: string, context?: LogContext): void
}

const SENSITIVE_KEYS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "password",
  "token",
  "secret",
  "apikey",
  "api_key",
])

function sanitize(context?: LogContext): LogContext | undefined {
  if (!context) return undefined

  const cleaned: LogContext = {}
  for (const [key, value] of Object.entries(context)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      cleaned[key] = "[REDACTED]"
    } else if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof Error)
    ) {
      cleaned[key] = sanitize(value as LogContext)
    } else if (value instanceof Error) {
      cleaned[key] = {
        name: value.name,
        message: value.message,
        stack: env.isDevelopment ? value.stack : undefined,
      }
    } else {
      cleaned[key] = value
    }
  }
  return cleaned
}

class ConsoleLogger implements Logger {
  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (env.isTest && level === "debug") {
      return
    }

    const sanitizedContext = sanitize(context)
    const timestamp = new Date().toISOString()

    if (env.isProduction) {
      const payload = {
        level,
        timestamp,
        message,
        ...sanitizedContext,
      }
      const serialized = JSON.stringify(payload)
      if (level === "error") {
        console.error(serialized)
      } else if (level === "warn") {
        console.warn(serialized)
      } else {
        console.log(serialized)
      }
      return
    }

    // Development formatting
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    const extra =
      sanitizedContext && Object.keys(sanitizedContext).length > 0
        ? ` ${JSON.stringify(sanitizedContext)}`
        : ""

    const formatted = `${prefix} ${message}${extra}`
    if (level === "error") {
      console.error(formatted)
    } else if (level === "warn") {
      console.warn(formatted)
    } else {
      console.log(formatted)
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context)
  }

  error(message: string, context?: LogContext): void {
    this.log("error", message, context)
  }
}

export const logger: Logger = new ConsoleLogger()
