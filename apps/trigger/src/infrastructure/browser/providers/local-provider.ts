import { chromium, type Browser } from "playwright-core"
import { BrowserError } from "../browser-errors"
import { PlaywrightSession } from "../browser-session"
import type {
  BrowserProvider,
  BrowserSession,
  CreateSessionOptions,
} from "../browser-types"
import { taskLogger } from "../../../shared/logging"

export class LocalBrowserProvider implements BrowserProvider {
  public readonly name = "local"
  private browserInstance: Browser | null = null

  constructor(
    private readonly headless = true,
    private readonly defaultNavigationTimeoutMs = 30000,
    private readonly defaultActionTimeoutMs = 10000
  ) {}

  public async createSession(
    options?: CreateSessionOptions
  ): Promise<BrowserSession> {
    try {
      taskLogger.info("[LocalBrowserProvider] Launching local Chromium browser")

      // Launch local browser
      const browser = await chromium.launch({
        headless: this.headless,
      })
      this.browserInstance = browser

      // Isolated context per session
      const context = await browser.newContext({
        viewport: options?.viewport ?? { width: 1280, height: 800 },
        userAgent: options?.userAgent,
        extraHTTPHeaders: options?.extraHttpHeaders,
      })

      const page = await context.newPage()

      return new PlaywrightSession(
        page,
        context,
        browser,
        this.defaultNavigationTimeoutMs,
        this.defaultActionTimeoutMs
      )
    } catch (error) {
      taskLogger.error(
        "[LocalBrowserProvider] Failed to launch local browser",
        {
          error: error instanceof Error ? error.message : String(error),
        }
      )
      throw BrowserError.launch(
        `Failed to launch local browser: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        error
      )
    }
  }

  public async close(): Promise<void> {
    if (this.browserInstance) {
      await this.browserInstance.close().catch(() => undefined)
      this.browserInstance = null
    }
  }
}
