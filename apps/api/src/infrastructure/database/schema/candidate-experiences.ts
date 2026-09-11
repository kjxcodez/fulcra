import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { candidateProfiles } from "./candidate-profiles"

export const candidateExperiences = pgTable("candidate_experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateProfileId: uuid("candidate_profile_id")
    .notNull()
    .references(() => candidateProfiles.id, { onDelete: "cascade" }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  employmentType: varchar("employment_type", { length: 50 }),
  location: varchar("location", { length: 255 }),
  startDate: varchar("start_date", { length: 10 }).notNull(),
  endDate: varchar("end_date", { length: 10 }),
  isCurrent: boolean("is_current").default(false).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const candidateExperiencesRelations = relations(
  candidateExperiences,
  ({ one }) => ({
    profile: one(candidateProfiles, {
      fields: [candidateExperiences.candidateProfileId],
      references: [candidateProfiles.id],
    }),
  })
)

export type CandidateExperience = typeof candidateExperiences.$inferSelect
export type NewCandidateExperience = typeof candidateExperiences.$inferInsert
