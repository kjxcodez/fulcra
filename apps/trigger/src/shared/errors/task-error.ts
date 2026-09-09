export type TaskErrorCode =
  | "TASK_VALIDATION_ERROR"
  | "TASK_DOMAIN_ERROR"
  | "TASK_TRANSIENT_ERROR"
  | "TASK_INTERNAL_ERROR"

export interface TaskErrorDetails {
  [key: string]: unknown
}

export class TaskError extends Error {
  public readonly code: TaskErrorCode
  public readonly isRetryable: boolean
  public readonly details?: TaskErrorDetails

  constructor(options: {
    message: string
    code: TaskErrorCode
    isRetryable?: boolean
    details?: TaskErrorDetails
    cause?: unknown
  }) {
    super(options.message, { cause: options.cause })
    this.name = "TaskError"
    this.code = options.code
    this.isRetryable = options.isRetryable ?? false
    this.details = options.details

    Object.setPrototypeOf(this, new.target.prototype)
  }

  static validation(
    message: string,
    details?: TaskErrorDetails
  ): TaskValidationError {
    return new TaskValidationError(message, details)
  }

  static domain(message: string, details?: TaskErrorDetails): TaskDomainError {
    return new TaskDomainError(message, details)
  }

  static transient(
    message: string,
    details?: TaskErrorDetails,
    cause?: unknown
  ): TaskTransientError {
    return new TaskTransientError(message, details, cause)
  }

  static internal(
    message = "An unexpected error occurred during task execution",
    details?: TaskErrorDetails,
    cause?: unknown
  ): TaskError {
    return new TaskError({
      message,
      code: "TASK_INTERNAL_ERROR",
      isRetryable: false,
      details,
      cause,
    })
  }
}

export class TaskValidationError extends TaskError {
  constructor(message: string, details?: TaskErrorDetails) {
    super({
      message,
      code: "TASK_VALIDATION_ERROR",
      isRetryable: false,
      details,
    })
    this.name = "TaskValidationError"
  }
}

export class TaskDomainError extends TaskError {
  constructor(message: string, details?: TaskErrorDetails) {
    super({
      message,
      code: "TASK_DOMAIN_ERROR",
      isRetryable: false,
      details,
    })
    this.name = "TaskDomainError"
  }
}

export class TaskTransientError extends TaskError {
  constructor(message: string, details?: TaskErrorDetails, cause?: unknown) {
    super({
      message,
      code: "TASK_TRANSIENT_ERROR",
      isRetryable: true,
      details,
      cause,
    })
    this.name = "TaskTransientError"
  }
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof TaskError) {
    return error.isRetryable
  }
  return false
}
