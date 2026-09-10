import type { BrowserContext, Page, Browser } from "playwright-core"
import {
  type ActionOptions,
  type BrowserSession,
  type NavigationOptions,
  type NavigationResponse,
  type ScreenshotOptions,
  type WaitForOptions,
} from "./browser-types"
import { mapPlaywrightError } from "./browser-errors"
import { sanitizeUrlForLogging, validateNavigationUrl } from "./browser-safety"
import { taskLogger } from "../../shared/logging"

export class PlaywrightSession implements BrowserSession {
  private isClosed = false

  constructor(
    private readonly page: Page,
    private readonly context: BrowserContext,
    private readonly browser?: Browser,
    private readonly defaultNavigationTimeoutMs = 30000,
    private readonly defaultActionTimeoutMs = 10000
  ) {
    this.page.setDefaultNavigationTimeout(defaultNavigationTimeoutMs)
    this.page.setDefaultTimeout(defaultActionTimeoutMs)
  }

  public async goto(
    url: string,
    options?: NavigationOptions
  ): Promise<NavigationResponse> {
    this.assertOpen()
    const validated = validateNavigationUrl(url)
    const sanitizedUrl = sanitizeUrlForLogging(validated.href)

    try {
      taskLogger.debug(`[BrowserSession] Navigating to ${sanitizedUrl}`)
      const response = await this.page.goto(validated.href, {
        timeout: options?.timeoutMs ?? this.defaultNavigationTimeoutMs,
        waitUntil: options?.waitUntil ?? "domcontentloaded",
      })

      return {
        status: response ? response.status() : null,
        url: this.page.url(),
      }
    } catch (error) {
      throw mapPlaywrightError(error, `navigation to ${sanitizedUrl}`)
    }
  }

  public async getTitle(): Promise<string> {
    this.assertOpen()
    try {
      return await this.page.title()
    } catch (error) {
      throw mapPlaywrightError(error, "getTitle")
    }
  }

  public async getUrl(): Promise<string> {
    this.assertOpen()
    return this.page.url()
  }

  public async click(selector: string, options?: ActionOptions): Promise<void> {
    this.assertOpen()
    try {
      await this.page.click(selector, {
        timeout: options?.timeoutMs ?? this.defaultActionTimeoutMs,
      })
    } catch (error) {
      throw mapPlaywrightError(error, `click("${selector}")`)
    }
  }

  public async fill(
    selector: string,
    value: string,
    options?: ActionOptions
  ): Promise<void> {
    this.assertOpen()
    try {
      await this.page.fill(selector, value, {
        timeout: options?.timeoutMs ?? this.defaultActionTimeoutMs,
      })
    } catch (error) {
      throw mapPlaywrightError(error, `fill("${selector}")`)
    }
  }

  public async type(
    selector: string,
    text: string,
    options?: ActionOptions
  ): Promise<void> {
    this.assertOpen()
    try {
      await this.page.locator(selector).pressSequentially(text, {
        timeout: options?.timeoutMs ?? this.defaultActionTimeoutMs,
      })
    } catch (error) {
      throw mapPlaywrightError(error, `type("${selector}")`)
    }
  }

  public async select(
    selector: string,
    value: string | string[],
    options?: ActionOptions
  ): Promise<string[]> {
    this.assertOpen()
    try {
      return await this.page.selectOption(selector, value, {
        timeout: options?.timeoutMs ?? this.defaultActionTimeoutMs,
      })
    } catch (error) {
      throw mapPlaywrightError(error, `select("${selector}")`)
    }
  }

  public async waitForSelector(
    selector: string,
    options?: WaitForOptions
  ): Promise<void> {
    this.assertOpen()
    try {
      await this.page.waitForSelector(selector, {
        timeout: options?.timeoutMs ?? this.defaultActionTimeoutMs,
        state: options?.state ?? "visible",
      })
    } catch (error) {
      throw mapPlaywrightError(error, `waitForSelector("${selector}")`)
    }
  }

  public async getText(
    selector: string,
    options?: ActionOptions
  ): Promise<string | null> {
    this.assertOpen()
    try {
      const locator = this.page.locator(selector)
      await locator.waitFor({
        state: "attached",
        timeout: options?.timeoutMs ?? this.defaultActionTimeoutMs,
      })
      return await locator.innerText()
    } catch (error) {
      throw mapPlaywrightError(error, `getText("${selector}")`)
    }
  }

  public async getAttribute(
    selector: string,
    name: string,
    options?: ActionOptions
  ): Promise<string | null> {
    this.assertOpen()
    try {
      const locator = this.page.locator(selector)
      await locator.waitFor({
        state: "attached",
        timeout: options?.timeoutMs ?? this.defaultActionTimeoutMs,
      })
      return await locator.getAttribute(name)
    } catch (error) {
      throw mapPlaywrightError(error, `getAttribute("${selector}", "${name}")`)
    }
  }

  public async screenshot(options?: ScreenshotOptions): Promise<Buffer> {
    this.assertOpen()
    try {
      return await this.page.screenshot({
        fullPage: options?.fullPage ?? false,
        type: options?.type ?? "png",
      })
    } catch (error) {
      throw mapPlaywrightError(error, "screenshot")
    }
  }

  public async evaluate<T, R>(fn: (arg: T) => R, arg?: T): Promise<R> {
    this.assertOpen()
    try {
      // Cast through unknown to adapt Playwright's PageFunction overload
      const pageFn = fn as unknown as (arg: unknown) => R
      return (await this.page.evaluate(pageFn, arg)) as R
    } catch (error) {
      throw mapPlaywrightError(error, "evaluate")
    }
  }

  public async close(): Promise<void> {
    if (this.isClosed) return
    this.isClosed = true

    try {
      await this.page.close().catch(() => undefined)
      await this.context.close().catch(() => undefined)
      if (this.browser) {
        await this.browser.close().catch(() => undefined)
      }
    } catch (error) {
      taskLogger.warn("[BrowserSession] Error closing browser session", {
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  private assertOpen(): void {
    if (this.isClosed) {
      throw mapPlaywrightError(
        new Error("Browser session has already been closed")
      )
    }
  }
}
