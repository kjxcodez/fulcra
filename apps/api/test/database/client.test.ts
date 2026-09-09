import { describe, expect, it } from "vitest"
import { createDbClient } from "../../src/infrastructure/database/client"
import { AppError } from "../../src/shared/errors/app-error"

describe("Database Client Infrastructure", () => {
  it("should create a database client when connection URL is provided", () => {
    const mockUrl =
      "postgresql://user:pass@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
    const client = createDbClient(mockUrl)
    expect(client).toBeDefined()
    expect(typeof client.select).toBe("function")
  })

  it("should throw AppError when querying through client without configured DATABASE_URL", () => {
    const unconfiguredClient = createDbClient("")
    expect(unconfiguredClient).toBeDefined()

    expect(() => {
      // Attempting to access query builder without DATABASE_URL
      unconfiguredClient.select()
    }).toThrow(AppError)

    try {
      unconfiguredClient.select()
    } catch (err) {
      expect(err).toBeInstanceOf(AppError)
      expect((err as AppError).code).toBe("INTERNAL_ERROR")
      expect((err as AppError).message).toContain("DATABASE_URL")
    }
  })
})
