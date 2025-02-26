import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { classes, languageClassEnrollments, users, languages } from ".";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// Language Classes Table
export const languageClasses = pgTable(
  "language_classes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    languageName: varchar("language_name").notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    languageId: uuid("language_id")
      .references(() => languages.id, { onDelete: "cascade" })
      .notNull(),
    level: varchar("level").notNull(),
  },
  (table) => ({
    languageNameIdx: index("language_classes_language_name_idx").on(
      table.languageName
    ),
    userIdIdx: index("language_classes_user_id_idx").on(table.userId),
  })
);

// Language classes Relations
export const languageClassRelations = relations(
  languageClasses,
  ({ one, many }) => ({
    language: one(languages, {
      fields: [languageClasses.languageId],
      references: [languages.id],
    }),
    classes: many(classes),
    enrollments: many(languageClassEnrollments),
    user: one(users, {
      fields: [languageClasses.userId],
      references: [users.id],
    }),
  })
);

// LanguageClass Type
export type LanguageClass = typeof languageClasses.$inferSelect;
export type NewLanguageClass = typeof languageClasses.$inferInsert;

// Drizzle Zod Schema
export const createLanguageClassesSchema = createInsertSchema(
  languageClasses
).omit({ id: true });
export const insertLanguageClassesSchema = createInsertSchema(languageClasses);

export const selectLanguageClassesSchema = createSelectSchema(languageClasses);
export const updateLanguageClassesSchema = createUpdateSchema(languageClasses);
