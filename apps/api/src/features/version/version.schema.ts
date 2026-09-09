import { z } from "zod"

export const versionResponseSchema = z.object({
  api: z.string(),
  version: z.string(),
  environment: z.string(),
})

export type VersionResponse = z.infer<typeof versionResponseSchema>
