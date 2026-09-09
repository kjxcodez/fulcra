import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { defineConfig } from "@trigger.dev/sdk/v3"

// Load .env if present for local configuration
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
      // Ignore
    }
  }
}

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_ID || "fulcra-trigger-local",
  runtime: "node",
  logLevel: "log",
  maxDuration: 300,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./src/tasks"],
})
