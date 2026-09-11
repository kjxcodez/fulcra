import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { candidateProfiles } from "./candidate-profiles"

export const candidatePreferences = pgTable("candidate_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateProfileId: uuid("candidate_profile_id")
    .notNull()
    .unique()
    .references(() => candidateProfiles.id, { onDelete: "cascade" }),
  desiredJobTitles: jsonb("desired_job_titles")
    .$type<string[]>()
    .default([])
    .notNull(),
  desiredEmploymentTypes: jsonb("desired_employment_types")
    .$type<string[]>()
    .default([])
    .notNull(),
  workLocationPreference: varchar("work_location_preference", { length: 50 })
    .default("any")
    .notNull(),
  preferredLocations: jsonb("preferred_locations")
    .$type<string[]>()
    .default([])
    .notNull(),
  salaryCurrency: varchar("salary_currency", { length: 10 })
    .default("USD")
    .notNull(),
  salaryMinimum: integer("salary_minimum"),
  salaryMaximum: integer("salary_maximum"),
  relocationPreference: varchar("relocation_preference", { length: 50 })
    .default("negotiable")
    .notNull(),
  sponsorshipRequired: boolean("sponsorship_required").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const candidatePreferencesRelations = relations(
  candidatePreferences,
  ({ one }) => ({
    profile: one(candidateProfiles, {
      fields: [candidatePreferences.candidateProfileId],
      references: [candidateProfiles.id],
    }),
  })
)

export type CandidatePreferences = typeof candidatePreferences.$inferSelect
export type NewCandidatePreferences = typeof candidatePreferences.$inferInsert
