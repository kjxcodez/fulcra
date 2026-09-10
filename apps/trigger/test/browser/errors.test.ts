import { describe, expect, it } from "vitest"
import {
  BrowserError,
  mapPlaywrightError,
} from "../../src/infrastructure/browser/browser-errors"
import { isRetryableError } from "../../src/shared/errors"

describe("BrowserError Classification & Mapping", () => {
  it("should classify transient browser errors as retryable", () => {
    const launchErr = BrowserError.launch(
      "Failed to connect to browser endpoint"
    )
    expect(launchErr.browserCode).toBe("BROWSER_LAUNCH_FAILED")
    expect(launchErr.isRetryable).toBe(true)
    expect(isRetryableError(launchErr)).toBe(true)

    const timeoutErr = BrowserError.timeout(
      "Navigation timed out after 30000ms"
    )
    expect(timeoutErr.browserCode).toBe("BROWSER_TIMEOUT")
    expect(timeoutErr.isRetryable).toBe(true)
    expect(isRetryableError(timeoutErr)).toBe(true)

    const navErr = BrowserError.navigation("net::ERR_CONNECTION_REFUSED")
    expect(navErr.browserCode).toBe("BROWSER_NAVIGATION_FAILED")
    expect(navErr.isRetryable).toBe(true)

    const providerErr = BrowserError.provider("Managed provider 503 upstream")
    expect(providerErr.browserCode).toBe("BROWSER_PROVIDER_ERROR")
    expect(providerErr.isRetryable).toBe(true)

    const expiredErr = BrowserError.sessionExpired("Target page was closed")
    expect(expiredErr.browserCode).toBe("BROWSER_SESSION_EXPIRED")
    expect(expiredErr.isRetryable).toBe(true)
  })

  it("should classify permanent/domain browser errors as non-retryable", () => {
    const actionErr = BrowserError.action("Element #submit-btn not found")
    expect(actionErr.browserCode).toBe("BROWSER_ACTION_FAILED")
    expect(actionErr.isRetryable).toBe(false)
    expect(isRetryableError(actionErr)).toBe(false)

    const authErr = BrowserError.authRequired("Session is not logged in")
    expect(authErr.browserCode).toBe("BROWSER_AUTH_REQUIRED")
    expect(authErr.isRetryable).toBe(false)

    const captchaErr = BrowserError.captchaRequired(
      "Cloudflare Turnstile challenge presented"
    )
    expect(captchaErr.browserCode).toBe("BROWSER_CAPTCHA_REQUIRED")
    expect(captchaErr.isRetryable).toBe(false)

    const safetyErr = BrowserError.safetyViolation("Invalid URL protocol")
    expect(safetyErr.browserCode).toBe("BROWSER_SAFETY_VIOLATION")
    expect(safetyErr.isRetryable).toBe(false)
  })

  it("should map Playwright timeout errors to BROWSER_TIMEOUT", () => {
    const pwError = new Error("page.goto: Timeout 30000ms exceeded.")
    const mapped = mapPlaywrightError(pwError, "navigation")
    expect(mapped).toBeInstanceOf(BrowserError)
    expect(mapped.browserCode).toBe("BROWSER_TIMEOUT")
    expect(mapped.isRetryable).toBe(true)
  })

  it("should map target closed errors to BROWSER_SESSION_EXPIRED", () => {
    const pwError = new Error("Protocol error: Target closed.")
    const mapped = mapPlaywrightError(pwError, "click")
    expect(mapped.browserCode).toBe("BROWSER_SESSION_EXPIRED")
    expect(mapped.isRetryable).toBe(true)
  })

  it("should map network errors to BROWSER_NAVIGATION_FAILED", () => {
    const pwError = new Error(
      "net::ERR_NAME_NOT_RESOLVED at https://invalid.example"
    )
    const mapped = mapPlaywrightError(pwError, "navigation")
    expect(mapped.browserCode).toBe("BROWSER_NAVIGATION_FAILED")
    expect(mapped.isRetryable).toBe(true)
  })

  it("should map CAPTCHA detection to BROWSER_CAPTCHA_REQUIRED", () => {
    const pwError = new Error("Cloudflare challenge page detected")
    const mapped = mapPlaywrightError(pwError, "inspection")
    expect(mapped.browserCode).toBe("BROWSER_CAPTCHA_REQUIRED")
    expect(mapped.isRetryable).toBe(false)
  })
})
