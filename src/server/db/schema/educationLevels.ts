import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// Education Level Table
export const educationLevels = pgTable(
  "education_levels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
  },
  (table) => ({
    nameIdx: index("name_idx").on(table.name),
  })
);

// EducationLevel Type
export type EducationLevel = typeof educationLevels.$inferInsert;

// Drizzle Zod Schema
export const insertEducationLevelSchema = createInsertSchema(
  educationLevels
).omit({ id: true });

export const selectEducationLevelSchema = createSelectSchema(educationLevels);
export const updateEducationLevelSchema = createUpdateSchema(educationLevels);
