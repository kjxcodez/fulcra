import { describe, expect, it } from "vitest"
import {
  TaskDomainError,
  TaskError,
  TaskTransientError,
  TaskValidationError,
  isRetryableError,
} from "../../src/shared/errors"

describe("Task Error Classification", () => {
  it("should correctly classify TaskValidationError as non-retryable", () => {
    const error = TaskError.validation("Invalid payload parameters", {
      field: "checkId",
    })
    expect(error).toBeInstanceOf(TaskValidationError)
    expect(error).toBeInstanceOf(TaskError)
    expect(error.code).toBe("TASK_VALIDATION_ERROR")
    expect(error.isRetryable).toBe(false)
    expect(isRetryableError(error)).toBe(false)
    expect(error.details?.field).toBe("checkId")
  })

  it("should correctly classify TaskDomainError as non-retryable", () => {
    const error = TaskError.domain("Entity already processed", {
      entityId: "123",
    })
    expect(error).toBeInstanceOf(TaskDomainError)
    expect(error).toBeInstanceOf(TaskError)
    expect(error.code).toBe("TASK_DOMAIN_ERROR")
    expect(error.isRetryable).toBe(false)
    expect(isRetryableError(error)).toBe(false)
  })

  it("should correctly classify TaskTransientError as retryable", () => {
    const error = TaskError.transient("External rate limit encountered", {
      retryAfterSec: 5,
    })
    expect(error).toBeInstanceOf(TaskTransientError)
    expect(error).toBeInstanceOf(TaskError)
    expect(error.code).toBe("TASK_TRANSIENT_ERROR")
    expect(error.isRetryable).toBe(true)
    expect(isRetryableError(error)).toBe(true)
  })

  it("should correctly classify generic errors as non-retryable", () => {
    const standardError = new Error("Standard unexpected exception")
    expect(isRetryableError(standardError)).toBe(false)
    expect(isRetryableError(null)).toBe(false)
    expect(isRetryableError("unknown error")).toBe(false)
  })
})
