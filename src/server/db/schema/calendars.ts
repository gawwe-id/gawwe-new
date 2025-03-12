import {
  boolean,
  date,
  index,
  // pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { assignments, classes, exams } from ".";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// calendar Table
export const calendars = pgTable(
  "calendars",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    classId: uuid("class_id")
      .references(() => classes.id, {
        onDelete: "cascade",
      })
      .notNull(),
    title: varchar("title").notNull(),
    description: varchar("description").notNull(),
    eventType: varchar("event_type").notNull(),
    date: date("date", { mode: "date" }).notNull(),
    isOnline: boolean("is_online").notNull(),
    link: varchar("link"),
  },
  (table) => ({
    classIdIdx: index("calendars_class_id_idx").on(table.classId),
    eventTypeIdx: index("calendars_event_type_idx").on(table.eventType),
  })
);

// calendars Relations
export const calendarRelations = relations(calendars, ({ many }) => ({
  // classes: one(classes),
  assignments: many(assignments),
  exams: many(exams),
}));

// Calendar Type
export type Calendar = typeof calendars.$inferSelect;
export type NewCalendar = typeof calendars.$inferInsert;

export const insertCalendarSchema = createInsertSchema(calendars);
export const selectCalendarSchema = createSelectSchema(calendars);
export const updateCalendarSchema = createUpdateSchema(calendars);
