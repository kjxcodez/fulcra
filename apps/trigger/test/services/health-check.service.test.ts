import { describe, expect, it } from "vitest"
import { healthCheckService } from "../../src/services/system/health-check.service"
import {
  TaskTransientError,
  TaskValidationError,
} from "../../src/shared/errors"

describe("HealthCheckService (Deterministic Business Logic)", () => {
  it("should execute deterministic health check and return structured status", async () => {
    const result = await healthCheckService.execute({
      checkId: "chk_test_12345",
      echo: "hello fulcra",
    })

    expect(result).toBeDefined()
    expect(result.status).toBe("healthy")
    expect(result.checkId).toBe("chk_test_12345")
    expect(result.echo).toBe("hello fulcra")
    expect(result.timestamp).toBeDefined()
    expect(new Date(result.timestamp).getTime()).not.toBeNaN()
    expect(result.runtime).toBeDefined()
    expect(result.runtime.nodeVersion).toBe(process.version)
  })

  it("should throw TaskValidationError when validation error is simulated", async () => {
    await expect(
      healthCheckService.execute({
        checkId: "chk_val_err",
        simulateValidationError: true,
      })
    ).rejects.toThrow(TaskValidationError)

    try {
      await healthCheckService.execute({
        checkId: "chk_val_err",
        simulateValidationError: true,
      })
    } catch (err) {
      expect(err).toBeInstanceOf(TaskValidationError)
      expect((err as TaskValidationError).code).toBe("TASK_VALIDATION_ERROR")
      expect((err as TaskValidationError).isRetryable).toBe(false)
    }
  })

  it("should throw TaskTransientError when transient error is simulated", async () => {
    await expect(
      healthCheckService.execute({
        checkId: "chk_transient_err",
        simulateTransientError: true,
      })
    ).rejects.toThrow(TaskTransientError)

    try {
      await healthCheckService.execute({
        checkId: "chk_transient_err",
        simulateTransientError: true,
      })
    } catch (err) {
      expect(err).toBeInstanceOf(TaskTransientError)
      expect((err as TaskTransientError).code).toBe("TASK_TRANSIENT_ERROR")
      expect((err as TaskTransientError).isRetryable).toBe(true)
    }
  })
})
