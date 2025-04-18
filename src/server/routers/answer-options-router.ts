import { answerOptions, questions } from "@/server/db/schema";
import { throwApiError } from "@/utils/api-error";
import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { insertAnswerOptionsSchema } from "../db/schema/answerOptions";

// Define input schemas
const OptionIdInput = z.object({ optionId: z.string() });
const QuestionIdInput = z.object({ questionId: z.string() });

// Schema for bulk creating options
const BulkOptionsInput = z.object({
  questionId: z.string(),
  options: z
    .array(
      z.object({
        option: z.string(),
        text: z.string(),
      })
    )
    .min(2),
});

// Schema for changing option is_correct status
const SetCorrectOptionInput = z.object({
  questionId: z.string(),
  optionId: z.string(),
});

export const answerOptionsRouter = j.router({
  /** ========================================
   * CREATE ANSWER OPTION
   ======================================== */
  create: privateProcedure
    .input(insertAnswerOptionsSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;

      // Check if the question exists
      const [question] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, input.questionId))
        .execute();

      if (!question) {
        throwApiError(404, "Question not found");
      }

      // Create the option
      const [newOption] = await db
        .insert(answerOptions)
        .values(input)
        .returning();

      return c.superjson(
        {
          message: "Answer option created successfully",
          data: newOption,
        },
        201
      );
    }),

  /** ========================================
   * GET OPTION BY ID
   ======================================== */
  byId: publicProcedure
    .input(OptionIdInput)
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { optionId } = input;

      // Get the option
      const [option] = await db
        .select()
        .from(answerOptions)
        .where(eq(answerOptions.id, optionId))
        .execute();

      if (!option) {
        throwApiError(404, "Option not found");
      }

      return c.superjson(
        {
          message: "Option retrieved successfully",
          data: option,
        },
        200
      );
    }),

  /** ========================================
   * LIST OPTIONS BY QUESTION ID
   ======================================== */
  byQuestionId: publicProcedure
    .input(QuestionIdInput)
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId } = input;

      // Check if the question exists
      const [question] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (!question) {
        throwApiError(404, "Question not found");
      }

      // Get all options for this question
      const options = await db
        .select()
        .from(answerOptions)
        .where(eq(answerOptions.questionId, questionId))
        .execute();

      return c.superjson(
        {
          message: "Options retrieved successfully",
          data: {
            question,
            options,
          },
        },
        200
      );
    }),

  /** ========================================
   * UPDATE ANSWER OPTION
   ======================================== */
  update: privateProcedure
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
   * DELETE ANSWER OPTION
   ======================================== */
  delete: privateProcedure
    .input(OptionIdInput)
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

      // Get the question ID to verify sufficient options remain
      const questionId = existingOption!.questionId;

      // Check if deleting this option would leave fewer than 2 options
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

      // Get the remaining options for the question
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
   * BULK CREATE OPTIONS FOR A QUESTION
   ======================================== */
  bulkCreate: privateProcedure
    .input(BulkOptionsInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId, options } = input;

      // Check if the question exists
      const [question] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (!question) {
        throwApiError(404, "Question not found");
      }

      // Prepare options with the question ID
      const optionsToInsert = options.map((option) => ({
        ...option,
        questionId,
      }));

      // Create all options
      const createdOptions = await db
        .insert(answerOptions)
        .values(optionsToInsert)
        .returning();

      return c.superjson(
        {
          message: "Options created successfully",
          data: {
            question,
            options: createdOptions,
          },
        },
        201
      );
    }),

  /** ========================================
   * DELETE ALL OPTIONS FOR A QUESTION
   ======================================== */
  deleteByQuestionId: privateProcedure
    .input(QuestionIdInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId } = input;

      // Check if the question exists
      const [question] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (!question) {
        throwApiError(404, "Question not found");
      }

      // Delete all options for this question
      const result = await db
        .delete(answerOptions)
        .where(eq(answerOptions.questionId, questionId))
        .returning();

      return c.superjson(
        {
          message: "All options for question deleted successfully",
          data: {
            questionId,
            deletedCount: result.length,
          },
        },
        200
      );
    }),

  /** ========================================
   * REPLACE ALL OPTIONS FOR A QUESTION
   ======================================== */
  replaceAll: privateProcedure
    .input(BulkOptionsInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId, options } = input;

      // Check if the question exists
      const [question] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (!question) {
        throwApiError(404, "Question not found");
      }

      // First delete all existing options
      await db
        .delete(answerOptions)
        .where(eq(answerOptions.questionId, questionId))
        .execute();

      // Prepare new options with the question ID
      const optionsToInsert = options.map((option) => ({
        ...option,
        questionId,
      }));

      // Create all options
      const createdOptions = await db
        .insert(answerOptions)
        .values(optionsToInsert)
        .returning();

      return c.superjson(
        {
          message: "All options replaced successfully",
          data: {
            question,
            options: createdOptions,
          },
        },
        200
      );
    }),

  /** ========================================
   * SET CORRECT ANSWER FOR QUESTION
   ======================================== */
  setCorrectOption: privateProcedure
    .input(SetCorrectOptionInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId, optionId } = input;

      // Check if the question exists
      const [question] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (!question) {
        throwApiError(404, "Question not found");
      }

      // Check if the option exists and belongs to this question
      const [option] = await db
        .select()
        .from(answerOptions)
        .where(
          and(
            eq(answerOptions.id, optionId),
            eq(answerOptions.questionId, questionId)
          )
        )
        .execute();

      if (!option) {
        throwApiError(404, "Option not found for this question");
      }

      // Update the question's correct answer
      const [updatedQuestion] = await db
        .update(questions)
        .set({
          correctAnswer: option!.option,
        })
        .where(eq(questions.id, questionId))
        .returning();

      return c.superjson(
        {
          message: "Correct answer set successfully",
          data: {
            question: updatedQuestion,
            selectedOption: option,
          },
        },
        200
      );
    }),
});
