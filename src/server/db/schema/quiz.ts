import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core"

import { assignments, exams } from "."
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// Quiz Table
export const quiz = pgTable(
  "quiz",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    examId: uuid("exam_id")
      .references(() => exams.id, { onDelete: "cascade" })
      .notNull(),
    assignmentId: uuid("assignment_id")
      .references(() => assignments.id, {
        onDelete: "cascade",
      })
      .notNull(),
    title: varchar("title").notNull(),
    description: varchar("description").notNull(),
  },
  (table) => ({
    examIdIdx: index("quiz_exam_id_idx").on(table.examId),
    assignmentIdIdx: index("quiz_assignment_id_idx").on(table.assignmentId),
  }),
)

// Quiz Type
export type Quiz = typeof quiz.$inferInsert

// Drizzle Zod Schema
export const createQuizSchema = createInsertSchema(quiz).omit({ id: true })

export const insertQuizSchema = createInsertSchema(quiz)
export const selectQuizSchema = createSelectSchema(quiz)
