import { describe, expect, it } from "vitest"
import { env } from "../../src/config/env"
import { RemoteBrowserProvider } from "../../src/infrastructure/browser/providers/remote-provider"
import { withBrowserSession } from "../../src/infrastructure/browser/lifecycle"

const hasLiveBrowser = Boolean(env.BROWSER_PROVIDER_URL)

describe.runIf(hasLiveBrowser)("Live Managed Browser Integration Tests", () => {
  it("should connect to remote managed browser provider, navigate to public page, and inspect title", async () => {
    const provider = new RemoteBrowserProvider(
      env.BROWSER_PROVIDER_URL || "",
      env.BROWSER_PROVIDER_TOKEN,
      20000,
      10000
    )

    try {
      const result = await withBrowserSession(
        provider,
        undefined,
        async (session) => {
          const response = await session.goto("https://example.com")
          expect(response.status).toBe(200)

          const title = await session.getTitle()
          expect(title.toLowerCase()).toContain("example")

          const url = await session.getUrl()
          expect(url).toContain("example.com")

          return { title, url }
        }
      )

      expect(result.title).toBeDefined()
    } finally {
      await provider.close()
    }
  })
})

describe.skipIf(hasLiveBrowser)(
  "Live Managed Browser Integration Tests (Skipped)",
  () => {
    it("skips live browser tests when BROWSER_PROVIDER_URL is not configured", () => {
      expect(true).toBe(true)
    })
  }
)
