import {
  index,
  pgTable,
  time,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { classes } from "./classes";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// Schedule days enum
export enum ScheduleDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

// Class Schedules Table
export const classSchedules = pgTable(
  "class_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    classId: uuid("class_id")
      .references(() => classes.id, { onDelete: "cascade" })
      .notNull(),
    day: varchar("day", {
      enum: Object.values(ScheduleDay) as [string, ...string[]],
    }).notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
  },
  (table) => ({
    classIdIdx: index("class_schedules_class_id_idx").on(table.classId),
    // Optional composite unique constraint to prevent duplicate day entries for a class
    dayClassUnique: uniqueIndex("class_schedules_day_class_unique").on(
      table.classId,
      table.day
    ),
  })
);

// Class Schedule Relations
export const classScheduleRelations = relations(classSchedules, ({ one }) => ({
  class: one(classes, {
    fields: [classSchedules.classId],
    references: [classes.id],
  }),
}));

// Add relation to classes
export const classRelationsWithSchedule = relations(classes, ({ many }) => ({
  schedules: many(classSchedules),
}));

// Class Schedule Type
export type ClassSchedule = typeof classSchedules.$inferSelect;
export type NewClassSchedule = typeof classSchedules.$inferInsert;

// Drizzle Zod Schema
export const insertClassScheduleSchema = createInsertSchema(classSchedules);
export const selectClassScheduleSchema = createSelectSchema(classSchedules);
export const updateClassScheduleSchema = createUpdateSchema(classSchedules);
