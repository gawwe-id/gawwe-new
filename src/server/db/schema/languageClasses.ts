import { index, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { classes, languageClassEnrollments, users } from "."
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// Language Classes Table
export const languageClasses = pgTable(
  "language_classes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    languageName: varchar("language_name").notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    level: varchar("level").notNull(),
  },
  (table) => ({
    languageNameIdx: index("language_classes_language_name_idx").on(
      table.languageName,
    ),
    userIdIdx: index("language_classes_user_id_idx").on(table.userId),
  }),
)

// Language classes Relations
export const languageClassRelations = relations(
  languageClasses,
  ({ many }) => ({
    classes: many(classes),
    enrollments: many(languageClassEnrollments),
  }),
)

// LanguageClass Type
export type LanguageClass = typeof languageClasses.$inferSelect

// Drizzle Zod Schema
export const createLanguageClassesSchema = createInsertSchema(
  languageClasses,
).omit({ id: true })
export const insertLanguageClassesSchema = createInsertSchema(languageClasses)

export const selectLanguageClassesSchema = createSelectSchema(languageClasses)
