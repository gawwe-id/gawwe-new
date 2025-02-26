import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { languageClasses } from ".";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const languages = pgTable(
  "languages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    code: varchar("code", { length: 5 }), // Optional ISO language code (e.g., "en", "ja")
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: index("languages_name_idx").on(table.name),
    codeIdx: index("languages_code_idx").on(table.code),
  })
);

export const languageRelations = relations(languages, ({ many }) => ({
  languageClasses: many(languageClasses),
}));

// Language Type
export type Language = typeof languages.$inferSelect;
export type NewLanguage = typeof languages.$inferInsert;

// Drizzle Zod Schema for Languages
export const createLanguageSchema = createInsertSchema(languages).omit({
  id: true,
  createdAt: true,
});
export const insertLanguageSchema = createInsertSchema(languages);
export const selectLanguageSchema = createSelectSchema(languages);
export const updateLanguageSchema = createUpdateSchema(languages);
