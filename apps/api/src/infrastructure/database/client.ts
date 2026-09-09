import { neon } from "@neondatabase/serverless"
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http"
import { env } from "../../config/env"
import { AppError } from "../../shared/errors/app-error"
import * as schema from "./schema"

export type FulcraDatabase = NeonHttpDatabase<typeof schema>

export function createDbClient(connectionString?: string): FulcraDatabase {
  const url = connectionString || env.DATABASE_URL

  if (!url) {
    // Return proxy that alerts when queried without configuration
    return new Proxy({} as FulcraDatabase, {
      get(_target, prop) {
        if (prop === "then") return undefined
        throw AppError.internal(
          "Database connection is not configured. DATABASE_URL environment variable is missing."
        )
      },
    })
  }

  const sql = neon(url)
  return drizzle(sql, { schema })
}

export const db = createDbClient()
