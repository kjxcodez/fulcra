import { schedules } from "@trigger.dev/sdk/v3"
import { taskLogger } from "../../shared/logging"

export interface MaintenancePingResult {
  status: "ok"
  timestamp: string
  scheduled: true
}

export const maintenancePingTask = schedules.task({
  id: "system.maintenance-ping",
  cron: "0 0 * * *", // Daily midnight UTC proving scheduling capability
  run: async (): Promise<MaintenancePingResult> => {
    const timestamp = new Date().toISOString()

    taskLogger.info("Executing scheduled maintenance ping", {
      taskId: "system.maintenance-ping",
      status: "running",
      timestamp,
    })

    return {
      status: "ok",
      timestamp,
      scheduled: true,
    }
  },
})
