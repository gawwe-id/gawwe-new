import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { languageClasses, users } from "."
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// Language classes Enrollment Table
export const languageClassEnrollments = pgTable(
  "language_class_enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    classId: uuid("class_id")
      .references(() => languageClasses.id, {
        onDelete: "cascade",
      })
      .notNull(),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("language_class_enrollments_user_id_idx").on(table.userId),
    classIdIdx: index("language_class_enrollments_class_id_idx").on(
      table.classId,
    ),
  }),
)

// LanguageClassEnrollment Type
export type LanguageClassEnrollment =
  typeof languageClassEnrollments.$inferInsert

// Drizzle Zod Schema
export const insertLanguageClassEnrollmentSchema = createInsertSchema(
  languageClassEnrollments,
)
export const selectLanguageClassEnrollmentSchema = createSelectSchema(
  languageClassEnrollments,
)

export const createLanguageClassEnrollmentSchema = createInsertSchema(
  languageClassEnrollments,
).omit({ id: true })
