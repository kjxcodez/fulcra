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

export const candidateEducation = pgTable("candidate_education", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateProfileId: uuid("candidate_profile_id")
    .notNull()
    .references(() => candidateProfiles.id, { onDelete: "cascade" }),
  institution: varchar("institution", { length: 255 }).notNull(),
  degree: varchar("degree", { length: 255 }),
  fieldOfStudy: varchar("field_of_study", { length: 255 }),
  startDate: varchar("start_date", { length: 10 }),
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

export const candidateEducationRelations = relations(
  candidateEducation,
  ({ one }) => ({
    profile: one(candidateProfiles, {
      fields: [candidateEducation.candidateProfileId],
      references: [candidateProfiles.id],
    }),
  })
)

export type CandidateEducation = typeof candidateEducation.$inferSelect
export type NewCandidateEducation = typeof candidateEducation.$inferInsert
