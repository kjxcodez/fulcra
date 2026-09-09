import { z } from "zod"
import { TaskError } from "../../shared/errors"

export const healthCheckInputSchema = z.object({
  checkId: z.string().min(1, "checkId is required"),
  echo: z
    .string()
    .max(100, "echo parameter cannot exceed 100 characters")
    .optional(),
  simulateTransientError: z.boolean().optional(),
  simulateValidationError: z.boolean().optional(),
})

export type HealthCheckInput = z.infer<typeof healthCheckInputSchema>

export interface HealthCheckResult {
  status: "healthy"
  checkId: string
  timestamp: string
  echo?: string
  runtime: {
    nodeVersion: string
    uptimeSeconds: number
  }
}

export class HealthCheckService {
  public async execute(input: HealthCheckInput): Promise<HealthCheckResult> {
    // 1. Validation check
    if (input.simulateValidationError) {
      throw TaskError.validation(
        "Simulated validation failure in health check service",
        {
          checkId: input.checkId,
        }
      )
    }

    // 2. Transient error simulation
    if (input.simulateTransientError) {
      throw TaskError.transient(
        "Simulated transient network timeout in health check service",
        {
          checkId: input.checkId,
        }
      )
    }

    // 3. Normal deterministic execution
    return {
      status: "healthy",
      checkId: input.checkId,
      timestamp: new Date().toISOString(),
      echo: input.echo,
      runtime: {
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
      },
    }
  }
}

export const healthCheckService = new HealthCheckService()
