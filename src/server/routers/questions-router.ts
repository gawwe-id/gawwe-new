import { answerOptions, questions, quiz } from "@/server/db/schema";
import { throwApiError } from "@/utils/api-error";
import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { insertQuestionSchema } from "../db/schema/questions";
import { insertAnswerOptionsSchema } from "../db/schema/answerOptions";

// Define input schemas
const QuestionIdInput = z.object({ questionId: z.string() });
const QuizIdInput = z.object({ quizId: z.string() });

// Schema for creating a question with options
const QuestionWithOptionsInput = insertQuestionSchema.extend({
  options: z.array(insertAnswerOptionsSchema).min(2),
});

// Schema for bulk creating questions
const BulkQuestionsInput = z.object({
  quizId: z.string(),
  questions: z.array(QuestionWithOptionsInput),
});

// Schema for updating a question's order
const UpdateQuestionOrderInput = z.object({
  questionId: z.string(),
  newOrder: z.number().int().positive(),
});

export const questionsRouter = j.router({
  /** ========================================
   * CREATE QUESTION WITH OPTIONS
   ======================================== */
  create: privateProcedure
    .input(QuestionWithOptionsInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { options, ...questionData } = input;

      // First, check if the quiz exists
      const [quizData] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.id, questionData.quizId))
        .execute();

      if (!quizData) {
        throwApiError(404, "Quiz not found");
      }

      // Determine the order for the new question (put it at the end)
      const [lastQuestion] = await db
        .select({ maxOrder: sql<number>`MAX(${questions.order})` })
        .from(questions)
        .where(eq(questions.quizId, questionData.quizId))
        .execute();

      const newOrder = (Number(lastQuestion?.maxOrder) || 0) + 1;

      // Create the question
      const [newQuestion] = await db
        .insert(questions)
        .values({
          ...questionData,
          order: newOrder,
        })
        .returning();

      if (!newQuestion) {
        throwApiError(500, "Failed to create question");
      }

      // Create the answer options
      const optionsToInsert = options.map((option) => ({
        ...option,
        questionId: newQuestion?.id,
      }));

      // Make sure questionId is not undefined before inserting
      const validOptionsToInsert = optionsToInsert.filter(
        (
          option
        ): option is { questionId: string; text: string; option: string } =>
          typeof option.questionId === "string"
      );

      const createdOptions = await db
        .insert(answerOptions)
        .values(validOptionsToInsert)
        .returning();

      return c.superjson(
        {
          message: "Question created successfully",
          data: {
            ...newQuestion,
            options: createdOptions,
          },
        },
        201
      );
    }),

  /** ========================================
   * GET QUESTION BY ID WITH OPTIONS
   ======================================== */
  byId: publicProcedure
    .input(QuestionIdInput)
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId } = input;

      // Get the question
      const [question] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (!question) {
        throwApiError(404, "Question not found");
      }

      // Get the answer options
      const options = await db
        .select()
        .from(answerOptions)
        .where(eq(answerOptions.questionId, questionId))
        .execute();

      return c.superjson(
        {
          message: "Question retrieved successfully",
          data: {
            ...question,
            options,
          },
        },
        200
      );
    }),

  /** ========================================
   * LIST QUESTIONS BY QUIZ ID
   ======================================== */
  byQuizId: publicProcedure
    .input(QuizIdInput)
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { quizId } = input;

      // Check if the quiz exists
      const [quizData] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.id, quizId))
        .execute();

      if (!quizData) {
        throwApiError(404, "Quiz not found");
      }

      // Get the questions for this quiz
      const questionsList = await db
        .select()
        .from(questions)
        .where(eq(questions.quizId, quizId))
        .orderBy(questions.order)
        .execute();

      if (questionsList.length === 0) {
        return c.superjson(
          {
            message: "No questions found for this quiz",
            data: {
              quiz: quizData,
              questions: [],
            },
          },
          200
        );
      }

      // Get the answer options for these questions
      const questionIds = questionsList.map((q) => q.id);
      const optionsList = await db
        .select()
        .from(answerOptions)
        .where(inArray(answerOptions.questionId, questionIds))
        .execute();

      // Combine questions with their options
      const questionsWithOptions = questionsList.map((question) => ({
        ...question,
        options: optionsList.filter(
          (option) => option.questionId === question.id
        ),
      }));

      return c.superjson(
        {
          message: "Questions retrieved successfully",
          data: {
            quiz: quizData,
            questions: questionsWithOptions,
          },
        },
        200
      );
    }),

  /** ========================================
   * UPDATE QUESTION
   ======================================== */
  update: privateProcedure
    .input(
      z.object({
        questionId: z.string(),
        data: z.object({
          text: z.string().optional(),
          correctAnswer: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId, data } = input;

      // Check if the question exists
      const [existingQuestion] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (!existingQuestion) {
        throwApiError(404, "Question not found");
      }

      // Update the question
      const [updatedQuestion] = await db
        .update(questions)
        .set(data)
        .where(eq(questions.id, questionId))
        .returning();

      // Get the answer options to return complete data
      const options = await db
        .select()
        .from(answerOptions)
        .where(eq(answerOptions.questionId, questionId))
        .execute();

      return c.superjson(
        {
          message: "Question updated successfully",
          data: {
            ...updatedQuestion,
            options,
          },
        },
        200
      );
    }),

  /** ========================================
   * DELETE QUESTION
   ======================================== */
  delete: privateProcedure
    .input(QuestionIdInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId } = input;

      // Check if the question exists
      const [existingQuestion] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (!existingQuestion) {
        throwApiError(404, "Question not found");
      }

      // Store the quiz ID and order for reordering remaining questions
      const quizId = existingQuestion!.quizId;
      const questionOrder = existingQuestion!.order;

      // Delete the question (this will cascade delete its answer options)
      await db.delete(questions).where(eq(questions.id, questionId)).execute();

      // Reorder remaining questions to maintain sequential ordering
      await db
        .update(questions)
        .set({ order: sql`${questions.order} - 1` })
        .where(
          and(
            eq(questions.quizId, quizId),
            sql`${questions.order} > ${questionOrder}`
          )
        )
        .execute();

      return c.superjson(
        {
          message: "Question deleted successfully",
        },
        200
      );
    }),

  /** ========================================
   * UPDATE QUESTION ORDER
   ======================================== */
  updateOrder: privateProcedure
    .input(UpdateQuestionOrderInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId, newOrder } = input;

      // Check if the question exists
      const [existingQuestion] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (!existingQuestion) {
        throwApiError(404, "Question not found");
      }

      const quizId = existingQuestion!.quizId;
      const currentOrder = existingQuestion!.order;

      // Get the count of questions in the quiz to validate new order
      const [questionCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(questions)
        .where(eq(questions.quizId, quizId))
        .execute();

      const totalQuestions = Number(questionCount?.count || 0);

      if (newOrder > totalQuestions) {
        throwApiError(
          400,
          `New order cannot exceed total questions count (${totalQuestions})`
        );
      }

      // Update the question order, moving other questions as needed
      if (newOrder < currentOrder) {
        // Moving up: increment the order of questions between new and current order
        await db
          .update(questions)
          .set({ order: sql`${questions.order} + 1` })
          .where(
            and(
              eq(questions.quizId, quizId),
              sql`${questions.order} >= ${newOrder}`,
              sql`${questions.order} < ${currentOrder}`
            )
          )
          .execute();
      } else if (newOrder > currentOrder) {
        // Moving down: decrement the order of questions between current and new order
        await db
          .update(questions)
          .set({ order: sql`${questions.order} - 1` })
          .where(
            and(
              eq(questions.quizId, quizId),
              sql`${questions.order} > ${currentOrder}`,
              sql`${questions.order} <= ${newOrder}`
            )
          )
          .execute();
      } else {
        // No change needed if the order is the same
        return c.superjson(
          {
            message: "Question order unchanged",
            data: existingQuestion,
          },
          200
        );
      }

      // Update the target question to the new order
      const [updatedQuestion] = await db
        .update(questions)
        .set({ order: newOrder })
        .where(eq(questions.id, questionId))
        .returning();

      return c.superjson(
        {
          message: "Question order updated successfully",
          data: updatedQuestion,
        },
        200
      );
    }),

  /** ========================================
   * ADD OPTION TO QUESTION
   ======================================== */
  addOption: privateProcedure
    .input(
      z.object({
        questionId: z.string(),
        option: insertAnswerOptionsSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId, option } = input;

      // Check if the question exists
      const [existingQuestion] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (!existingQuestion) {
        throwApiError(404, "Question not found");
      }

      // Create the option
      const [newOption] = await db
        .insert(answerOptions)
        .values({
          ...option,
          questionId,
        })
        .returning();

      // Get all options for the question to return complete data
      const allOptions = await db
        .select()
        .from(answerOptions)
        .where(eq(answerOptions.questionId, questionId))
        .execute();

      return c.superjson(
        {
          message: "Option added successfully",
          data: {
            question: existingQuestion,
            options: allOptions,
            newOption,
          },
        },
        201
      );
    }),

  /** ========================================
   * UPDATE OPTION
   ======================================== */
  updateOption: privateProcedure
    .input(
      z.object({
        optionId: z.string(),
        data: z.object({
          option: z.string().optional(),
          text: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { optionId, data } = input;

      // Check if the option exists
      const [existingOption] = await db
        .select()
        .from(answerOptions)
        .where(eq(answerOptions.id, optionId))
        .execute();

      if (!existingOption) {
        throwApiError(404, "Option not found");
      }

      // Update the option
      const [updatedOption] = await db
        .update(answerOptions)
        .set(data)
        .where(eq(answerOptions.id, optionId))
        .returning();

      return c.superjson(
        {
          message: "Option updated successfully",
          data: updatedOption,
        },
        200
      );
    }),

  /** ========================================
   * DELETE OPTION
   ======================================== */
  deleteOption: privateProcedure
    .input(z.object({ optionId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { optionId } = input;

      // Check if the option exists
      const [existingOption] = await db
        .select()
        .from(answerOptions)
        .where(eq(answerOptions.id, optionId))
        .execute();

      if (!existingOption) {
        throwApiError(404, "Option not found");
      }

      // Get the question ID to return remaining options later
      const questionId = existingOption!.questionId;

      // Check if this would leave the question with fewer than 2 options
      const [optionCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(answerOptions)
        .where(eq(answerOptions.questionId, questionId))
        .execute();

      if (Number(optionCount?.count || 0) <= 2) {
        throwApiError(
          400,
          "Cannot delete option: questions must have at least 2 options"
        );
      }

      // Delete the option
      await db
        .delete(answerOptions)
        .where(eq(answerOptions.id, optionId))
        .execute();

      // Get the remaining options
      const remainingOptions = await db
        .select()
        .from(answerOptions)
        .where(eq(answerOptions.questionId, questionId))
        .execute();

      return c.superjson(
        {
          message: "Option deleted successfully",
          data: {
            deletedOptionId: optionId,
            remainingOptions,
          },
        },
        200
      );
    }),

  /** ========================================
   * BULK CREATE QUESTIONS
   ======================================== */
  bulkCreate: privateProcedure
    .input(BulkQuestionsInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { quizId, questions: questionsInput } = input;

      // Check if the quiz exists
      const [quizData] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.id, quizId))
        .execute();

      if (!quizData) {
        throwApiError(404, "Quiz not found");
      }

      // Determine the starting order for new questions
      const [lastQuestion] = await db
        .select({ maxOrder: sql<number>`MAX(${questions.order})` })
        .from(questions)
        .where(eq(questions.quizId, quizId))
        .execute();

      let nextOrder = (Number(lastQuestion?.maxOrder) || 0) + 1;

      // Create the questions and their options
      const createdQuestions = await Promise.all(
        questionsInput.map(async (questionInput) => {
          const { options, ...questionData } = questionInput;

          // Create the question
          const [newQuestion] = await db
            .insert(questions)
            .values({
              ...questionData,
              quizId,
              order: nextOrder++,
            })
            .returning();

          if (!newQuestion) {
            throwApiError(500, "Failed to create question");
          }

          // Create the answer options
          const optionsToInsert = options.map((option) => ({
            ...option,
            questionId: newQuestion?.id,
          }));

          const createdOptions = await db
            .insert(answerOptions)
            .values(optionsToInsert as any[])
            .returning();

          return {
            ...newQuestion,
            options: createdOptions,
          };
        })
      );

      return c.superjson(
        {
          message: "Questions created successfully",
          data: {
            quiz: quizData,
            questions: createdQuestions,
          },
        },
        201
      );
    }),
});
