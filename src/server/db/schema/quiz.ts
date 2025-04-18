import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { assignments, exams } from ".";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// Quiz Table
export const quiz = pgTable(
  "quiz",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    examId: uuid("exam_id").references(() => exams.id, { onDelete: "cascade" }),
    assignmentId: uuid("assignment_id").references(() => assignments.id, {
      onDelete: "cascade",
    }),
    title: varchar("title").notNull(),
    description: varchar("description").notNull(),
  },
  (table) => ({
    examIdIdx: index("quiz_exam_id_idx").on(table.examId),
    assignmentIdIdx: index("quiz_assignment_id_idx").on(table.assignmentId),
  })
);

// Quiz Type
export type Quiz = typeof quiz.$inferInsert;

// Drizzle Zod Schema
export const insertQuizSchema = createInsertSchema(quiz).refine(
  (data) => data.examId !== undefined || data.assignmentId !== undefined,
  {
    message: "Quiz must be associated with either an exam or an assignment",
  }
);
export const selectQuizSchema = createSelectSchema(quiz);
export const updateQuizSchema = createUpdateSchema(quiz);
