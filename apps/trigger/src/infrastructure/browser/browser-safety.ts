import { BrowserError } from "./browser-errors"

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"])
const SENSITIVE_PARAM_NAMES = new Set([
  "token",
  "auth",
  "key",
  "secret",
  "password",
  "code",
  "apikey",
  "api_key",
  "access_token",
])

export function validateNavigationUrl(inputUrl: string): URL {
  let parsed: URL
  try {
    parsed = new URL(inputUrl)
  } catch {
    throw BrowserError.safetyViolation(
      `Invalid URL format provided: "${inputUrl}"`
    )
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw BrowserError.safetyViolation(
      `Disallowed URL protocol "${parsed.protocol}". Only HTTP and HTTPS protocols are permitted.`
    )
  }

  return parsed
}

export function sanitizeUrlForLogging(inputUrl: string): string {
  try {
    const parsed = new URL(inputUrl)
    // Strip user/password credentials
    parsed.username = ""
    parsed.password = ""

    // Strip sensitive query params
    for (const param of parsed.searchParams.keys()) {
      if (SENSITIVE_PARAM_NAMES.has(param.toLowerCase())) {
        parsed.searchParams.set(param, "[REDACTED]")
      }
    }

    return parsed.toString()
  } catch {
    return "[MALFORMED_URL]"
  }
}
