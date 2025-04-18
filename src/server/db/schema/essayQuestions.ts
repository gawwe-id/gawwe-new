import { index, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { assignments, exams } from ".";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Essay Questions Table
export const essayQuestions = pgTable(
  "essay_questions",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    examId: uuid("exam_id").references(() => exams.id, { onDelete: "cascade" }),
    assignmentId: uuid("assignment_id").references(() => assignments.id, {
      onDelete: "cascade",
    }),
    questionText: varchar("question_text").notNull(),
    maxWords: integer("max_words"),
  },
  (table) => ({
    examIdIdx: index("exam_id_idx").on(table.examId),
    assignmentIdIdx: index("assignment_id_idx").on(table.assignmentId),
  })
);

// EssayQuestion Type
export type EssayQuestion = typeof essayQuestions.$inferInsert;

// Drizzle Zod Schema
export const createEssayQuestionSchema = createInsertSchema(essayQuestions)
  .omit({ id: true })
  .refine(
    (data) => data.examId !== undefined || data.assignmentId !== undefined,
    {
      message:
        "Essay question must be associated with either an exam or an assignment",
    }
  );

export const insertEssayQuestionSchema = createInsertSchema(
  essayQuestions
).refine(
  (data) => data.examId !== undefined || data.assignmentId !== undefined,
  {
    message:
      "Essay question must be associated with either an exam or an assignment",
  }
);
export const selectEssayQuestionSchema = createSelectSchema(essayQuestions);
