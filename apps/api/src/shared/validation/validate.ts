import { zValidator } from "@hono/zod-validator"
import type { ValidationTargets } from "hono"
import type { ZodType } from "zod"
import { AppError } from "../errors/app-error"

export interface FormattedValidationIssue {
  field: string
  message: string
}

export function formatZodIssues(error: {
  issues: Array<{ path?: Array<PropertyKey>; message: string }>
}): FormattedValidationIssue[] {
  return error.issues.map((issue) => ({
    field:
      issue.path && issue.path.length > 0
        ? issue.path.map((segment) => String(segment)).join(".")
        : "root",
    message: issue.message,
  }))
}

export function validate<
  Target extends keyof ValidationTargets,
  Schema extends ZodType,
>(target: Target, schema: Schema) {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      const details = formatZodIssues(result.error)
      throw AppError.validation("Request validation failed", details)
    }
  })
}
