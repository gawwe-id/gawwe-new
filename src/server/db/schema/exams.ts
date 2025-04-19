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

// Exams Table
export const exams = pgTable(
  "exams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    calendarId: uuid("calendar_id").references(() => calendars.id, {
      onDelete: "cascade",
    }),
    classId: uuid("class_id").references(() => classes.id, {
      onDelete: "cascade",
    }),
    title: varchar("title").notNull(),
    description: varchar("description"),
    examDate: timestamp("exam_date").notNull().defaultNow(),
    status: varchar("status", {
      enum: ["draft", "published", "ongoing", "completed", "cancelled"],
    }).default("draft"),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    isOnline: boolean("is_online").default(false),
    link: varchar("link"),
  },
  (table) => ({
    titleExamIdx: index("exams_title_exam_idx").on(table.title),
    classIdIdx: index("exams_class_id_idx").on(table.classId),
    calendarIdIdx: index("exams_calendar_id_idx").on(table.calendarId),
  })
);

// Exam Type
export type Exam = typeof exams.$inferInsert;

// Drizzle Zod Schema
export const insertExamSchema = createInsertSchema(exams);
export const selectExamSchema = createSelectSchema(exams);
export const updateExamSchema = createUpdateSchema(exams);
