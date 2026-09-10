import { describe, expect, it } from "vitest"
import { MockBrowserProvider } from "../../src/infrastructure/browser/providers/mock-provider"
import { withBrowserSession } from "../../src/infrastructure/browser/lifecycle"

describe("Browser Lifecycle & Context Isolation", () => {
  it("should create session, execute operation, and close cleanly", async () => {
    const provider = new MockBrowserProvider()
    let recordedSession: unknown = null

    const result = await withBrowserSession(
      provider,
      undefined,
      async (session) => {
        recordedSession = session
        await session.goto("https://example.com")
        const title = await session.getTitle()
        return { title }
      }
    )

    expect(result.title).toContain("example.com")
    expect(provider.activeSessions.length).toBe(1)
    expect(provider.activeSessions[0].isClosed).toBe(true)
    expect(recordedSession).toBe(provider.activeSessions[0])
  })

  it("should ensure session is closed even if the inner function throws an error", async () => {
    const provider = new MockBrowserProvider()

    await expect(
      withBrowserSession(provider, undefined, async (session) => {
        await session.goto("https://example.com")
        throw new Error("Simulated failure inside browser automation block")
      })
    ).rejects.toThrow("Simulated failure inside browser automation block")

    expect(provider.activeSessions.length).toBe(1)
    expect(provider.activeSessions[0].isClosed).toBe(true)
  })

  it("should create isolated sessions for concurrent operations", async () => {
    const provider = new MockBrowserProvider()

    const [res1, res2] = await Promise.all([
      withBrowserSession(provider, undefined, async (session) => {
        await session.goto("https://alpha.com")
        return await session.getTitle()
      }),
      withBrowserSession(provider, undefined, async (session) => {
        await session.goto("https://beta.com")
        return await session.getTitle()
      }),
    ])

    expect(res1).toContain("alpha.com")
    expect(res2).toContain("beta.com")
    expect(provider.activeSessions.length).toBe(2)
    expect(provider.activeSessions[0].isClosed).toBe(true)
    expect(provider.activeSessions[1].isClosed).toBe(true)
  })
})
