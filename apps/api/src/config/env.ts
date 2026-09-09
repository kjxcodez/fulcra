import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  API_ENV: z
    .enum(["local", "development", "staging", "production"])
    .default("local"),
  WEB_ORIGIN: z.string().default("http://localhost:3000"),
  API_VERSION: z.string().default("0.1.0"),
})

export type Env = z.infer<typeof envSchema>

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const issues = result.error.format()
    console.error(
      "Invalid API environment configuration:",
      JSON.stringify(issues, null, 2)
    )
    throw new Error(
      `Invalid API environment configuration: ${result.error.message}`
    )
  }

  return result.data
}

const parsedEnv = loadEnv()

export const env = {
  ...parsedEnv,
  isDevelopment: parsedEnv.NODE_ENV === "development",
  isProduction: parsedEnv.NODE_ENV === "production",
  isTest: parsedEnv.NODE_ENV === "test",
}
