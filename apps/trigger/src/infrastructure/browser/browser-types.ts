export type BrowserActionType = "read-only" | "side-effecting"

export interface NavigationOptions {
  timeoutMs?: number
  waitUntil?: "load" | "domcontentloaded" | "networkidle"
}

export interface ActionOptions {
  timeoutMs?: number
}

export interface WaitForOptions {
  timeoutMs?: number
  state?: "attached" | "detached" | "visible" | "hidden"
}

export interface ScreenshotOptions {
  fullPage?: boolean
  type?: "png" | "jpeg"
}

export interface NavigationResponse {
  status: number | null
  url: string
}

export interface CreateSessionOptions {
  viewport?: {
    width: number
    height: number
  }
  userAgent?: string
  extraHttpHeaders?: Record<string, string>
}

export interface BrowserSession {
  goto(url: string, options?: NavigationOptions): Promise<NavigationResponse>
  getTitle(): Promise<string>
  getUrl(): Promise<string>
  click(selector: string, options?: ActionOptions): Promise<void>
  fill(selector: string, value: string, options?: ActionOptions): Promise<void>
  type(selector: string, text: string, options?: ActionOptions): Promise<void>
  select(
    selector: string,
    value: string | string[],
    options?: ActionOptions
  ): Promise<string[]>
  waitForSelector(selector: string, options?: WaitForOptions): Promise<void>
  getText(selector: string, options?: ActionOptions): Promise<string | null>
  getAttribute(
    selector: string,
    name: string,
    options?: ActionOptions
  ): Promise<string | null>
  screenshot(options?: ScreenshotOptions): Promise<Buffer>
  evaluate<T, R>(fn: (arg: T) => R, arg?: T): Promise<R>
  close(): Promise<void>
}

export interface BrowserProvider {
  readonly name: string
  createSession(options?: CreateSessionOptions): Promise<BrowserSession>
  close(): Promise<void>
}
