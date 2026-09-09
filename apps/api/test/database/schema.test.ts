import { describe, expect, it } from "vitest"
import { getTableColumns, getTableName } from "drizzle-orm"
import {
  candidateProfiles,
  candidateProfilesRelations,
  users,
  usersRelations,
} from "../../src/infrastructure/database/schema"

describe("Database Schema Definitions", () => {
  describe("users table", () => {
    it("should have correct table name and columns", () => {
      expect(getTableName(users)).toBe("users")

      const columns = getTableColumns(users)
      expect(columns.id).toBeDefined()
      expect(columns.id.primary).toBe(true)
      expect(columns.id.dataType).toBe("string") // UUID represented as string

      expect(columns.email).toBeDefined()
      expect(columns.email.notNull).toBe(true)
      expect(columns.email.isUnique).toBe(true)

      expect(columns.name).toBeDefined()
      expect(columns.name.notNull).toBe(false)

      expect(columns.createdAt).toBeDefined()
      expect(columns.createdAt.notNull).toBe(true)

      expect(columns.updatedAt).toBeDefined()
      expect(columns.updatedAt.notNull).toBe(true)
    })
  })

  describe("candidate_profiles table", () => {
    it("should have correct table name and columns", () => {
      expect(getTableName(candidateProfiles)).toBe("candidate_profiles")

      const columns = getTableColumns(candidateProfiles)
      expect(columns.id).toBeDefined()
      expect(columns.id.primary).toBe(true)

      expect(columns.userId).toBeDefined()
      expect(columns.userId.notNull).toBe(true)
      expect(columns.userId.isUnique).toBe(true)

      expect(columns.headline).toBeDefined()
      expect(columns.summary).toBeDefined()

      expect(columns.createdAt).toBeDefined()
      expect(columns.createdAt.notNull).toBe(true)

      expect(columns.updatedAt).toBeDefined()
      expect(columns.updatedAt.notNull).toBe(true)
    })
  })

  describe("Relations", () => {
    it("should define valid relations between users and candidate_profiles", () => {
      expect(usersRelations).toBeDefined()
      expect(candidateProfilesRelations).toBeDefined()
      expect(typeof usersRelations.config).toBe("function")
      expect(typeof candidateProfilesRelations.config).toBe("function")
    })
  })
})
