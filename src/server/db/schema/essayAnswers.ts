import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { essayQuestions, users } from "."
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// Essay Answers Table
export const essayAnswers = pgTable(
  "essay_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    essayQuestionId: uuid("essay_question_id")
      .references(() => essayQuestions.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id)
      .notNull(),
    answerText: varchar("answer_text").notNull(),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    grade: integer("grade").notNull(),
    feedback: varchar("feedback"),
  },
  (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
    essayQuestionIdIdx: index("essay_question_id_idx").on(
      table.essayQuestionId,
    ),
  }),
)

// EssayAnswer Type
export type EssayAnswer = typeof essayAnswers.$inferInsert

// Drizzle Zod Schema
export const createEssayAnswerSchema = createInsertSchema(essayAnswers).omit({
  id: true,
})

export const insertEssayAnswerSchema = createInsertSchema(essayAnswers)
export const selectEssayAnswerSchema = createSelectSchema(essayAnswers)
