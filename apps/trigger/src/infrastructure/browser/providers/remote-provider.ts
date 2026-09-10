import { chromium, type Browser } from "playwright-core"
import { BrowserError } from "../browser-errors"
import { PlaywrightSession } from "../browser-session"
import type {
  BrowserProvider,
  BrowserSession,
  CreateSessionOptions,
} from "../browser-types"
import { taskLogger } from "../../../shared/logging"

export class RemoteBrowserProvider implements BrowserProvider {
  public readonly name = "remote"
  private browserInstance: Browser | null = null

  constructor(
    private readonly endpointUrl: string,
    private readonly apiKey?: string,
    private readonly defaultNavigationTimeoutMs = 30000,
    private readonly defaultActionTimeoutMs = 10000
  ) {}

  public async createSession(
    options?: CreateSessionOptions
  ): Promise<BrowserSession> {
    if (!this.endpointUrl) {
      throw BrowserError.launch(
        "Cannot connect to remote browser: BROWSER_PROVIDER_URL is not configured."
      )
    }

    try {
      taskLogger.info(
        "[RemoteBrowserProvider] Connecting to managed browser endpoint"
      )

      const headers: Record<string, string> = {
        ...options?.extraHttpHeaders,
      }
      if (this.apiKey) {
        headers["Authorization"] = `Bearer ${this.apiKey}`
      }

      // Connect to remote CDP / WebSocket endpoint
      const browser = await chromium.connect(this.endpointUrl, {
        headers,
        timeout: 20000,
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
        "[RemoteBrowserProvider] Failed to connect or create remote browser session",
        {
          error: error instanceof Error ? error.message : String(error),
        }
      )
      throw BrowserError.provider(
        `Failed to launch remote browser session: ${error instanceof Error ? error.message : String(error)}`,
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
