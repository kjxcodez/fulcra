import { z } from "zod"

export const healthQuerySchema = z.object({
  echo: z
    .string()
    .max(50, "Echo string must not exceed 50 characters")
    .optional(),
})

export type HealthQuery = z.infer<typeof healthQuerySchema>

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  timestamp: z.string(),
  echo: z.string().optional(),
})

export type HealthResponse = z.infer<typeof healthResponseSchema>
