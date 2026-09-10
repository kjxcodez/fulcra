import { describe, expect, it } from "vitest"
import {
  sanitizeUrlForLogging,
  validateNavigationUrl,
} from "../../src/infrastructure/browser/browser-safety"
import { BrowserError } from "../../src/infrastructure/browser/browser-errors"

describe("Browser URL Safety & Sanitization", () => {
  it("should permit valid HTTP and HTTPS URLs", () => {
    expect(() =>
      validateNavigationUrl("https://example.com/jobs")
    ).not.toThrow()
    expect(() =>
      validateNavigationUrl("http://localhost:3000/status")
    ).not.toThrow()

    const parsed = validateNavigationUrl("https://sub.domain.org/path?q=test")
    expect(parsed.hostname).toBe("sub.domain.org")
    expect(parsed.protocol).toBe("https:")
  })

  it("should reject disallowed protocols with BrowserError.safetyViolation", () => {
    expect(() => validateNavigationUrl("file:///etc/passwd")).toThrow(
      BrowserError
    )
    expect(() => validateNavigationUrl("javascript:alert(1)")).toThrow(
      BrowserError
    )
    expect(() => validateNavigationUrl("ftp://files.example.com")).toThrow(
      BrowserError
    )
    expect(() => validateNavigationUrl("data:text/html,<h1>test</h1>")).toThrow(
      BrowserError
    )
  })

  it("should reject malformed URL strings", () => {
    expect(() => validateNavigationUrl("not a url")).toThrow(BrowserError)
    expect(() => validateNavigationUrl("")).toThrow(BrowserError)
  })

  it("should sanitize credentials and sensitive query parameters for logging", () => {
    const rawUrl =
      "https://user:secretpassword@api.example.com/jobs?token=supersecret123&q=software+engineer&auth=jwt_abc"
    const sanitized = sanitizeUrlForLogging(rawUrl)

    expect(sanitized).not.toContain("secretpassword")
    expect(sanitized).not.toContain("supersecret123")
    expect(sanitized).not.toContain("jwt_abc")
    expect(sanitized).toContain("token=%5BREDACTED%5D")
    expect(sanitized).toContain("q=software+engineer")
  })
})
