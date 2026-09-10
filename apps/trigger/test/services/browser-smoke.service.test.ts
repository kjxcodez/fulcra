import { describe, expect, it } from "vitest"
import { MockBrowserProvider } from "../../src/infrastructure/browser/providers/mock-provider"
import { BrowserSmokeService } from "../../src/services/system/browser-smoke.service"

describe("BrowserSmokeService (Deterministic Automation Logic)", () => {
  it("should execute smoke test against target URL and return structured result", async () => {
    const mockProvider = new MockBrowserProvider()
    const service = new BrowserSmokeService(mockProvider)

    const result = await service.execute({
      url: "https://example.com",
      expectedTitleSubstring: "example.com",
    })

    expect(result).toBeDefined()
    expect(result.status).toBe("success")
    expect(result.url).toBe("https://example.com/")
    expect(result.title).toContain("example.com")
    expect(result.provider).toBe("mock")
    expect(result.durationMs).toBeGreaterThanOrEqual(0)
    expect(result.timestamp).toBeDefined()

    // Ensure session was cleaned up
    expect(mockProvider.activeSessions.length).toBe(1)
    expect(mockProvider.activeSessions[0].isClosed).toBe(true)
  })

  it("should support default parameters without error", async () => {
    const mockProvider = new MockBrowserProvider()
    const service = new BrowserSmokeService(mockProvider)

    const result = await service.execute({})

    expect(result).toBeDefined()
    expect(result.status).toBe("success")
    expect(result.url).toBe("https://example.com/")
  })
})
