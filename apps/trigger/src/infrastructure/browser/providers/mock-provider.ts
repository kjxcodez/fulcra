import {
  type ActionOptions,
  type BrowserProvider,
  type BrowserSession,
  type CreateSessionOptions,
  type NavigationOptions,
  type NavigationResponse,
  type ScreenshotOptions,
  type WaitForOptions,
} from "../browser-types"
import { validateNavigationUrl } from "../browser-safety"
import { BrowserError } from "../browser-errors"

export class MockBrowserSession implements BrowserSession {
  public isClosed = false
  public currentUrl = "about:blank"
  public currentTitle = "Mock Page"
  public readonly actionsLog: Array<{ action: string; args: unknown[] }> = []

  constructor(public readonly options?: CreateSessionOptions) {}

  public async goto(
    url: string,
    _options?: NavigationOptions
  ): Promise<NavigationResponse> {
    this.assertOpen()
    const validated = validateNavigationUrl(url)
    this.currentUrl = validated.href
    this.currentTitle = `Mock Page: ${validated.hostname}`
    this.actionsLog.push({ action: "goto", args: [url] })
    return { status: 200, url: this.currentUrl }
  }

  public async getTitle(): Promise<string> {
    this.assertOpen()
    this.actionsLog.push({ action: "getTitle", args: [] })
    return this.currentTitle
  }

  public async getUrl(): Promise<string> {
    this.assertOpen()
    return this.currentUrl
  }

  public async click(
    selector: string,
    _options?: ActionOptions
  ): Promise<void> {
    this.assertOpen()
    this.actionsLog.push({ action: "click", args: [selector] })
  }

  public async fill(
    selector: string,
    value: string,
    _options?: ActionOptions
  ): Promise<void> {
    this.assertOpen()
    this.actionsLog.push({ action: "fill", args: [selector, value] })
  }

  public async type(
    selector: string,
    text: string,
    _options?: ActionOptions
  ): Promise<void> {
    this.assertOpen()
    this.actionsLog.push({ action: "type", args: [selector, text] })
  }

  public async select(
    selector: string,
    value: string | string[],
    _options?: ActionOptions
  ): Promise<string[]> {
    this.assertOpen()
    this.actionsLog.push({ action: "select", args: [selector, value] })
    return Array.isArray(value) ? value : [value]
  }

  public async waitForSelector(
    selector: string,
    _options?: WaitForOptions
  ): Promise<void> {
    this.assertOpen()
    this.actionsLog.push({ action: "waitForSelector", args: [selector] })
  }

  public async getText(
    selector: string,
    _options?: ActionOptions
  ): Promise<string | null> {
    this.assertOpen()
    this.actionsLog.push({ action: "getText", args: [selector] })
    return `Mock text content for ${selector}`
  }

  public async getAttribute(
    selector: string,
    name: string,
    _options?: ActionOptions
  ): Promise<string | null> {
    this.assertOpen()
    this.actionsLog.push({ action: "getAttribute", args: [selector, name] })
    return `mock-${name}-value`
  }

  public async screenshot(_options?: ScreenshotOptions): Promise<Buffer> {
    this.assertOpen()
    this.actionsLog.push({ action: "screenshot", args: [] })
    return Buffer.from("mock-screenshot-bytes")
  }

  public async evaluate<T, R>(fn: (arg: T) => R, arg?: T): Promise<R> {
    this.assertOpen()
    this.actionsLog.push({ action: "evaluate", args: [arg] })
    return fn(arg as T)
  }

  public async close(): Promise<void> {
    this.isClosed = true
    this.actionsLog.push({ action: "close", args: [] })
  }

  private assertOpen(): void {
    if (this.isClosed) {
      throw BrowserError.sessionExpired("Mock session is already closed")
    }
  }
}

export class MockBrowserProvider implements BrowserProvider {
  public readonly name = "mock"
  public activeSessions: MockBrowserSession[] = []
  public isClosed = false

  public async createSession(
    options?: CreateSessionOptions
  ): Promise<BrowserSession> {
    if (this.isClosed) {
      throw BrowserError.provider("MockBrowserProvider is closed")
    }
    const session = new MockBrowserSession(options)
    this.activeSessions.push(session)
    return session
  }

  public async close(): Promise<void> {
    this.isClosed = true
    for (const session of this.activeSessions) {
      await session.close()
    }
    this.activeSessions = []
  }
}
