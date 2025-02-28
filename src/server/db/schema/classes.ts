import {
  date,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { assignments, calendars, exams, languageClasses, payments } from ".";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// Classes Table
export const classes = pgTable(
  "classes",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name").notNull(),
    description: varchar("description").notNull(),
    languageClassId: uuid("language_class_id")
      .references(() => languageClasses.id, { onDelete: "cascade" })
      .notNull(),
    batch: integer("batch").notNull(),
    startDate: date("start_date", { mode: "date" }).notNull(),
    endDate: date("end_date", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    nameIdx: index("classes_name_idx").on(table.name),
    languageClassIdIdx: index("classes_language_class_id_idx").on(
      table.languageClassId
    ),
  })
);

// Classes Relations
export const classRelations = relations(classes, ({ many }) => ({
  calendar: many(calendars),
  assignments: many(assignments),
  exams: many(exams),
  payments: many(payments),
}));

// Class Type
export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;

// Drizzle Zod Schema
export const insertClassSchema = createInsertSchema(classes);
export const selectClassSchema = createSelectSchema(classes);
export const updateClassSchema = createUpdateSchema(classes);
