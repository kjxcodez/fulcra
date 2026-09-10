import { describe, expect, it } from "vitest"
import {
  MockBrowserProvider,
  MockBrowserSession,
} from "../../src/infrastructure/browser/providers/mock-provider"
import { BrowserError } from "../../src/infrastructure/browser/browser-errors"

describe("MockBrowserProvider & MockBrowserSession", () => {
  it("should implement all standard BrowserSession interaction methods", async () => {
    const provider = new MockBrowserProvider()
    expect(provider.name).toBe("mock")

    const session = await provider.createSession({
      userAgent: "CustomUserAgent/1.0",
    })

    // Navigation
    const navResult = await session.goto("https://test.example.com")
    expect(navResult.status).toBe(200)
    expect(await session.getUrl()).toBe("https://test.example.com/")
    expect(await session.getTitle()).toBe("Mock Page: test.example.com")

    // Form interactions
    await session.fill("#username", "candidate@fulcra.internal")
    await session.type("#password", "mock-password")
    await session.click("#submit")
    const selected = await session.select("#country", "US")
    expect(selected).toEqual(["US"])

    // Inspection
    await session.waitForSelector("#results")
    const text = await session.getText("#header")
    expect(text).toContain("#header")
    const attr = await session.getAttribute("a.link", "href")
    expect(attr).toBe("mock-href-value")

    // Media and evaluation
    const screenshotBuffer = await session.screenshot()
    expect(Buffer.isBuffer(screenshotBuffer)).toBe(true)

    const evaluated = await session.evaluate((x: number) => x * 2, 21)
    expect(evaluated).toBe(42)

    // Cleanup
    await session.close()
    expect((session as MockBrowserSession).isClosed).toBe(true)

    // Asserting after close throws BrowserError
    await expect(session.getTitle()).rejects.toThrow(BrowserError)
  })

  it("should throw error if attempting to create session on closed provider", async () => {
    const provider = new MockBrowserProvider()
    await provider.close()
    expect(provider.isClosed).toBe(true)

    await expect(provider.createSession()).rejects.toThrow(BrowserError)
  })
})
