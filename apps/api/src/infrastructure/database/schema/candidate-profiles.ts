import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { candidateEducation } from "./candidate-education"
import { candidateExperiences } from "./candidate-experiences"
import { candidatePreferences } from "./candidate-preferences"
import { candidateSkills } from "./candidate-skills"
import { users } from "./users"

export const candidateProfiles = pgTable("candidate_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: varchar("display_name", { length: 255 }),
  headline: varchar("headline", { length: 255 }),
  summary: text("summary"),
  phone: varchar("phone", { length: 50 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const usersRelations = relations(users, ({ one }) => ({
  candidateProfile: one(candidateProfiles, {
    fields: [users.id],
    references: [candidateProfiles.userId],
  }),
}))

export const candidateProfilesRelations = relations(
  candidateProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [candidateProfiles.userId],
      references: [users.id],
    }),
    experiences: many(candidateExperiences),
    education: many(candidateEducation),
    skills: many(candidateSkills),
    preferences: one(candidatePreferences),
  })
)

export type CandidateProfile = typeof candidateProfiles.$inferSelect
export type NewCandidateProfile = typeof candidateProfiles.$inferInsert
