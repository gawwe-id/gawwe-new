import { index, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core"

import { quiz } from "."
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// questions Table
export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    text: varchar("text").notNull(),
    correctAnswer: varchar("correct_answer").notNull(),
    order: integer("order").notNull(),
  },
  (table) => ({
    quizIdIdx: index("quiz_id_idx").on(table.quizId),
  }),
)

// Question Type
export type Question = typeof questions.$inferInsert

// Drizzle Zod Schema
export const createQuestionSchema = createInsertSchema(questions).omit({
  id: true,
})

export const insertQuestionSchema = createInsertSchema(questions)
export const selectQuestionSchema = createSelectSchema(questions)
