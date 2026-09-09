import { task } from "@trigger.dev/sdk/v3"
import {
  healthCheckInputSchema,
  healthCheckService,
  type HealthCheckInput,
  type HealthCheckResult,
} from "../../services/system/health-check.service"
import { taskLogger } from "../../shared/logging"

export const healthCheckTask = task({
  id: "system.health-check",
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
    randomize: true,
  },
  run: async (payload: HealthCheckInput): Promise<HealthCheckResult> => {
    taskLogger.info("Starting system.health-check execution", {
      taskId: "system.health-check",
      status: "running",
      checkId: payload?.checkId,
    })

    // Validate input strictly with Zod schema
    const validated = healthCheckInputSchema.parse(payload)

    // Execute deterministic business logic via service adapter
    const result = await healthCheckService.execute(validated)

    taskLogger.info("Completed system.health-check execution", {
      taskId: "system.health-check",
      status: "completed",
      checkId: result.checkId,
    })

    return result
  },
})
