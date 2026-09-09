import { describe, expect, it } from "vitest"
import { healthCheckTask } from "../../src/tasks/system/health-check.task"
import { healthCheckInputSchema } from "../../src/services/system/health-check.service"

describe("HealthCheckTask (Trigger.dev Task Adapter)", () => {
  it("should have expected task metadata and trigger methods", () => {
    expect(healthCheckTask.id).toBe("system.health-check")
    expect(typeof healthCheckTask.trigger).toBe("function")
    expect(typeof healthCheckTask.triggerAndWait).toBe("function")
    expect(typeof healthCheckTask.batchTrigger).toBe("function")
  })

  it("should validate valid task input schema", () => {
    const validPayload = {
      checkId: "chk_9876",
      echo: "test echo",
    }

    const parsed = healthCheckInputSchema.safeParse(validPayload)
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.checkId).toBe("chk_9876")
      expect(parsed.data.echo).toBe("test echo")
    }
  })

  it("should reject task input missing required checkId", () => {
    const invalidPayload = {
      echo: "missing checkId",
    }

    const parsed = healthCheckInputSchema.safeParse(invalidPayload)
    expect(parsed.success).toBe(false)
  })

  it("should reject task input with echo exceeding max length", () => {
    const invalidPayload = {
      checkId: "chk_toolong",
      echo: "a".repeat(101),
    }

    const parsed = healthCheckInputSchema.safeParse(invalidPayload)
    expect(parsed.success).toBe(false)
  })
})
