import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core"

import { questions } from "."
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

// Answer Option Table
export const answerOptions = pgTable(
  "answer_options",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    questionId: uuid("question_id")
      .references(() => questions.id, { onDelete: "cascade" })
      .notNull(),
    option: varchar("option").notNull(),
    text: varchar("text").notNull(),
  },
  (table) => ({
    questionIdIdx: index("question_id_idx").on(table.questionId),
  }),
)

// AnswerOption Type
export type AnswerOption = typeof answerOptions.$inferInsert

// Drizzle Zod Schema
export const createAnswerOptionsSchema = createInsertSchema(answerOptions).omit(
  { id: true },
)

export const insertAnswerOptionsSchema = createInsertSchema(answerOptions)
export const selectAnswerOptionsSchema = createSelectSchema(answerOptions)
