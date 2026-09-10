import { task } from "@trigger.dev/sdk/v3"
import {
  browserSmokeInputSchema,
  browserSmokeService,
  type BrowserSmokeInput,
  type BrowserSmokeResult,
} from "../../services/system/browser-smoke.service"
import { taskLogger } from "../../shared/logging"

/**
 * Internal Trigger.dev infrastructure verification task.
 *
 * ARCHITECTURAL BOUNDARY:
 * This task is an internal Trigger.dev infrastructure task and is NOT a public API capability.
 * Arbitrary URL navigation is an INTERNAL capability only for infrastructure smoke-testing.
 * It must never be exposed through public HTTP endpoints (no POST /api/v1/browser/... routes).
 */
export const browserSmokeTask = task({
  id: "system.browser-smoke-test",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
    randomize: true,
  },
  run: async (payload: BrowserSmokeInput): Promise<BrowserSmokeResult> => {
    taskLogger.info("Starting system.browser-smoke-test task execution", {
      taskId: "system.browser-smoke-test",
      status: "running",
    })

    const validated = browserSmokeInputSchema.parse(payload || {})
    const result = await browserSmokeService.execute(validated)

    taskLogger.info("Completed system.browser-smoke-test task execution", {
      taskId: "system.browser-smoke-test",
      status: "completed",
      title: result.title,
      durationMs: result.durationMs,
    })

    return result
  },
})
