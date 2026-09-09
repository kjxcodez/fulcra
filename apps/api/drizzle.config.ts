import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { defineConfig } from "drizzle-kit"

if (typeof process.loadEnvFile === "function") {
  const currentDir =
    typeof import.meta.dirname === "string"
      ? import.meta.dirname
      : process.cwd()

  const candidatePaths = [
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), ".env.local"),
    resolve(currentDir, ".env"),
    resolve(currentDir, "../../.env"),
  ]

  for (const envPath of candidatePaths) {
    try {
      if (existsSync(envPath)) {
        process.loadEnvFile(envPath)
      }
    } catch {
      // Ignore if not present
    }
  }
}

export default defineConfig({
  schema: "./src/infrastructure/database/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
})
