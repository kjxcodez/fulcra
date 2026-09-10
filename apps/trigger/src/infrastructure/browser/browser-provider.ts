import { env } from "../../config/env"
import type { BrowserProvider } from "./browser-types"
import { LocalBrowserProvider } from "./providers/local-provider"
import { MockBrowserProvider } from "./providers/mock-provider"
import { RemoteBrowserProvider } from "./providers/remote-provider"
import { taskLogger } from "../../shared/logging"

export type BrowserProviderType = "remote" | "local" | "mock"

export function createBrowserProvider(
  type?: BrowserProviderType
): BrowserProvider {
  const resolvedType =
    type || (env.BROWSER_PROVIDER as BrowserProviderType) || "mock"

  taskLogger.debug(
    `[BrowserProviderFactory] Resolving provider type: ${resolvedType}`
  )

  switch (resolvedType) {
    case "remote":
      return new RemoteBrowserProvider(
        env.BROWSER_PROVIDER_URL || "",
        env.BROWSER_PROVIDER_TOKEN,
        env.BROWSER_NAVIGATION_TIMEOUT_MS,
        env.BROWSER_ACTION_TIMEOUT_MS
      )

    case "local":
      return new LocalBrowserProvider(
        true,
        env.BROWSER_NAVIGATION_TIMEOUT_MS,
        env.BROWSER_ACTION_TIMEOUT_MS
      )

    case "mock":
    default:
      return new MockBrowserProvider()
  }
}

// Global cached provider instance for task runtime
let defaultProviderInstance: BrowserProvider | null = null

export function getBrowserProvider(
  type?: BrowserProviderType
): BrowserProvider {
  if (type) {
    return createBrowserProvider(type)
  }
  if (!defaultProviderInstance) {
    defaultProviderInstance = createBrowserProvider()
  }
  return defaultProviderInstance
}

export function resetBrowserProvider(): void {
  if (defaultProviderInstance) {
    defaultProviderInstance.close().catch(() => undefined)
    defaultProviderInstance = null
  }
}
