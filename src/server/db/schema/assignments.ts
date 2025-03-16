import {
  boolean,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { calendars, classes } from ".";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// Assignments Table
export const assignments = pgTable(
  "assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    calendarId: uuid("calendar_id").references(() => calendars.id, {
      onDelete: "cascade",
    }),
    classId: uuid("class_id").references(() => classes.id, {
      onDelete: "cascade",
    }),
    title: varchar("title").notNull(),
    description: varchar("description").notNull(),
    dueDate: timestamp("due_date").notNull().defaultNow(),
    hasQuiz: boolean("has_quiz").default(false).notNull(),
    hasEssay: boolean("has_essay").default(false).notNull(),
  },
  (table) => ({
    titleAssignmentIdx: index("title_assignment_idx").on(table.title),
    classIdIdx: index("class_id_idx").on(table.classId),
    calendarIdIdx: index("calendar_id_idx").on(table.calendarId),
  })
);

// Assignment Type
export type Assignment = typeof assignments.$inferInsert;
export type NewAssignment = typeof assignments.$inferInsert;

// Drizzle Zod Schema
export const insertAssignmentSchema = createInsertSchema(assignments);
export const selectAssignmentSchema = createSelectSchema(assignments);
export const updateAssignmentSchema = createUpdateSchema(assignments);
