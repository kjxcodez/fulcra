import { relations } from "drizzle-orm"
import {
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { candidateProfiles } from "./candidate-profiles"

export const candidateSkills = pgTable(
  "candidate_skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    candidateProfileId: uuid("candidate_profile_id")
      .notNull()
      .references(() => candidateProfiles.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    displayName: varchar("display_name", { length: 100 }).notNull(),
    proficiency: varchar("proficiency", { length: 50 }),
    yearsOfExperience: integer("years_of_experience"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    unique("candidate_skills_profile_name_unique").on(
      table.candidateProfileId,
      table.name
    ),
  ]
)

export const candidateSkillsRelations = relations(
  candidateSkills,
  ({ one }) => ({
    profile: one(candidateProfiles, {
      fields: [candidateSkills.candidateProfileId],
      references: [candidateProfiles.id],
    }),
  })
)

export type CandidateSkill = typeof candidateSkills.$inferSelect
export type NewCandidateSkill = typeof candidateSkills.$inferInsert
