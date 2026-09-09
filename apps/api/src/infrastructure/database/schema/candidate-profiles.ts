import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { users } from "./users"

export const candidateProfiles = pgTable("candidate_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  headline: varchar("headline", { length: 255 }),
  summary: text("summary"),
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
  ({ one }) => ({
    user: one(users, {
      fields: [candidateProfiles.userId],
      references: [users.id],
    }),
  })
)

export type CandidateProfile = typeof candidateProfiles.$inferSelect
export type NewCandidateProfile = typeof candidateProfiles.$inferInsert
