import type {
  BrowserProvider,
  BrowserSession,
  CreateSessionOptions,
} from "./browser-types"
import { taskLogger } from "../../shared/logging"

export async function withBrowserSession<T>(
  provider: BrowserProvider,
  options: CreateSessionOptions | undefined,
  fn: (session: BrowserSession) => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  taskLogger.debug(
    `[BrowserLifecycle] Creating session using provider "${provider.name}"`
  )
  const session = await provider.createSession(options)

  try {
    return await fn(session)
  } finally {
    const durationMs = Date.now() - startTime
    taskLogger.debug(`[BrowserLifecycle] Closing session after ${durationMs}ms`)
    await session.close().catch((err) => {
      taskLogger.warn("[BrowserLifecycle] Failed to close session cleanly", {
        error: err instanceof Error ? err.message : String(err),
      })
    })
  }
}
