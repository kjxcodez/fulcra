import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { z } from "zod"

// Load environment variables from .env files if present (Node >= 20.12)
if (typeof process.loadEnvFile === "function") {
  const currentDir =
    typeof import.meta.dirname === "string"
      ? import.meta.dirname
      : process.cwd()

  const candidatePaths = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), ".env.local"),
    resolve(currentDir, "../../.env"),
    resolve(currentDir, "../../../.env"),
  ]

  for (const envPath of candidatePaths) {
    try {
      if (existsSync(envPath)) {
        process.loadEnvFile(envPath)
      }
    } catch {
      // Ignore if file cannot be read or is invalid
    }
  }
}

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
  DATABASE_URL: z.string().url().optional(),
  TRIGGER_PROJECT_ID: z.string().optional(),
  TRIGGER_SECRET_KEY: z.string().optional(),
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
