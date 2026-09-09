import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { migrate } from "drizzle-orm/neon-http/migrator"
import { env } from "../../config/env"
import { logger } from "../logger"

export async function runMigrations(databaseUrl?: string): Promise<void> {
  const url = databaseUrl || env.DATABASE_URL
  if (!url) {
    throw new Error(
      "Cannot run migrations: DATABASE_URL environment variable is missing."
    )
  }

  logger.info("Connecting to Neon PostgreSQL for migrations...")
  const sql = neon(url)
  const db = drizzle(sql)

  logger.info("Ensuring PostgreSQL pgvector extension is enabled...")
  await sql`CREATE EXTENSION IF NOT EXISTS vector;`

  const currentDir =
    typeof import.meta.dirname === "string"
      ? import.meta.dirname
      : process.cwd()

  const candidateMigrationFolders = [
    resolve(process.cwd(), "drizzle"),
    resolve(process.cwd(), "apps/api/drizzle"),
    resolve(currentDir, "../../../drizzle"),
  ]

  const migrationsFolder =
    candidateMigrationFolders.find((folder) => existsSync(folder)) ||
    "./drizzle"

  logger.info(`Applying migrations from ${migrationsFolder}...`)
  await migrate(db, { migrationsFolder })
  logger.info("Database migrations applied successfully.")
}

// Direct execution entrypoint
if (
  process.argv[1] &&
  (process.argv[1].endsWith("migrate.ts") ||
    process.argv[1].endsWith("migrate.js"))
) {
  runMigrations()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error("Migration failed:", error)
      process.exit(1)
    })
}
