import { describe, expect, it } from "vitest"
import { TriggerDispatcher } from "../../src/infrastructure/trigger/dispatcher"

describe("TriggerDispatcher (API -> Background Boundary)", () => {
  it("should handle offline / unconfigured mode gracefully as dry-run", async () => {
    const dispatcher = new TriggerDispatcher()
    const result = await dispatcher.dispatch(
      "system.health-check",
      { checkId: "chk_test_101", echo: "api-test" },
      { idempotencyKey: "test:idempotency:key:1" }
    )

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.taskId).toBe("system.health-check")
    expect(result.idempotencyKey).toBe("test:idempotency:key:1")
  })

  it("should support dispatching without optional parameters", async () => {
    const dispatcher = new TriggerDispatcher()
    const result = await dispatcher.dispatch("system.health-check", {
      checkId: "chk_minimal",
    })

    expect(result).toBeDefined()
    expect(result.success).toBe(true)
    expect(result.taskId).toBe("system.health-check")
    expect(result.idempotencyKey).toBeUndefined()
  })
})
