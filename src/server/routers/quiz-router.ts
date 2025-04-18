import {
  answerOptions,
  assignments,
  exams,
  questions,
  quiz,
} from "@/server/db/schema";
import { throwApiError } from "@/utils/api-error";
import { eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { insertQuizSchema, updateQuizSchema } from "@/server/db/schema/quiz";

// Define a QuizId input schema
const QuizIdInput = z.object({ id: z.string() });

export const quizRouter = j.router({
  /** ========================================
   * CREATE QUIZ WITH QUESTIONS AND OPTIONS
   ======================================== */
  create: privateProcedure
    .input(insertQuizSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { ...quizInput } = input;

      // Validate that either examId or assignmentId is provided
      if (!quizInput.examId && !quizInput.assignmentId) {
        throwApiError(
          400,
          "Quiz must be associated with either an exam or an assignment"
        );
      }

      // If this is for an assignment, validate that the assignment exists and has hasQuiz=true
      if (quizInput.assignmentId) {
        const assignmentResult = await db
          .select()
          .from(assignments)
          .where(eq(assignments.id, quizInput.assignmentId))
          .execute();

        if (assignmentResult.length === 0) {
          throwApiError(404, "Assignment not found");
        }

        const assignment = assignmentResult[0];
        if (assignment && !assignment.hasQuiz) {
          throwApiError(400, "This assignment does not support quizzes");
        }
      }

      // If this is for an exam, validate that the exam exists
      if (quizInput.examId) {
        const examResult = await db
          .select()
          .from(exams)
          .where(eq(exams.id, quizInput.examId))
          .execute();

        if (examResult.length === 0) {
          throwApiError(404, "Exam not found");
        }
      }

      // Create the quiz
      const quizResult = await db.insert(quiz).values(quizInput).returning();

      if (quizResult.length === 0) {
        throwApiError(500, "Failed to create quiz");
      }

      const newQuiz = quizResult[0];
      if (!newQuiz || !newQuiz.id) {
        throwApiError(500, "Failed to create quiz properly");
      }

      return c.superjson(
        {
          message: "Quiz created successfully",
          data: {
            ...newQuiz,
          },
        },
        201
      );
    }),

  /** ========================================
   * GET QUIZ BY ID WITH QUESTIONS AND OPTIONS
   ======================================== */
  byId: publicProcedure.input(QuizIdInput).query(async ({ c, ctx, input }) => {
    const { db } = ctx;
    const { id } = input;

    // Get the quiz
    const [quizData] = await db
      .select()
      .from(quiz)
      .where(eq(quiz.id, id))
      .execute();

    if (!quizData) {
      throwApiError(404, "Quiz not found");
    }

    // Get all questions for this quiz
    const questionsList = await db
      .select()
      .from(questions)
      .where(eq(questions.quizId, id))
      .orderBy(questions.order)
      .execute();

    if (questionsList.length === 0) {
      return c.superjson(
        {
          message: "Quiz found",
          data: {
            ...quizData,
            questions: [],
          },
        },
        200
      );
    }

    // Get all options for these questions
    const questionIds = questionsList.map((question) => question.id);
    const optionsList = await db
      .select()
      .from(answerOptions)
      .where(inArray(answerOptions.questionId, questionIds))
      .execute();

    // Associate options with their questions
    const questionsWithOptions = questionsList.map((question) => ({
      ...question,
      options: optionsList.filter(
        (option) => option.questionId === question.id
      ),
    }));

    return c.superjson(
      {
        message: "Quiz found",
        data: {
          ...quizData,
          questions: questionsWithOptions,
        },
      },
      200
    );
  }),

  /** ========================================
   * LIST ALL QUIZZES
   ======================================== */
  list: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    const quizList = await db.select().from(quiz).execute();

    return c.superjson(
      {
        message: "Quizzes retrieved successfully",
        data: quizList,
      },
      200
    );
  }),

  /** ========================================
   * GET QUIZZES BY EXAM ID
   ======================================== */
  byExamId: publicProcedure
    .input(z.object({ examId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { examId } = input;

      const quizzes = await db
        .select()
        .from(quiz)
        .where(eq(quiz.examId, examId))
        .execute();

      return c.superjson(
        {
          message: "Quizzes retrieved successfully",
          data: quizzes,
        },
        200
      );
    }),

  /** ========================================
   * GET QUIZZES BY ASSIGNMENT ID
   ======================================== */
  byAssignmentId: publicProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { assignmentId } = input;

      const quizzes = await db
        .select()
        .from(quiz)
        .where(eq(quiz.assignmentId, assignmentId))
        .execute();

      return c.superjson(
        {
          message: "Quizzes retrieved successfully",
          data: quizzes,
        },
        200
      );
    }),

  /** ========================================
   * UPDATE QUIZ
   ======================================== */
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateQuizSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { id, data } = input;

      // First check if the quiz exists
      const [existingQuiz] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.id, id))
        .execute();

      if (!existingQuiz) {
        throwApiError(404, "Quiz not found");
      }

      // Update the quiz
      const [updatedQuiz] = await db
        .update(quiz)
        .set(data)
        .where(eq(quiz.id, id))
        .returning();

      return c.superjson(
        {
          message: "Quiz updated successfully",
          data: updatedQuiz,
        },
        200
      );
    }),

  /** ========================================
   * DELETE QUIZ
   ======================================== */
  delete: privateProcedure
    .input(QuizIdInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      // First check if the quiz exists
      const [existingQuiz] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.id, id))
        .execute();

      if (!existingQuiz) {
        throwApiError(404, "Quiz not found");
      }

      // Delete the quiz (questions and options will be deleted by cascade)
      await db.delete(quiz).where(eq(quiz.id, id));

      return c.superjson(
        {
          message: "Quiz deleted successfully",
        },
        200
      );
    }),

  /** ========================================
   * ADD QUESTION TO QUIZ
   ======================================== */
  addQuestion: privateProcedure
    .input(
      z.object({
        quizId: z.string(),
        question: z.object({
          text: z.string(),
          correctAnswer: z.string(),
          options: z
            .array(
              z.object({
                option: z.string(),
                text: z.string(),
              })
            )
            .min(1),
        }),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { quizId, question: questionInput } = input;
      const { options, ...questionData } = questionInput;

      // Check if quiz exists
      const [existingQuiz] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.id, quizId))
        .execute();

      if (!existingQuiz) {
        throwApiError(404, "Quiz not found");
      }

      // Get current highest order
      const orderResults = await db
        .select({ order: questions.order })
        .from(questions)
        .where(eq(questions.quizId, quizId))
        .orderBy(sql`questions.order DESC`)
        .limit(1)
        .execute();

      const nextOrder =
        orderResults.length > 0 ? (orderResults[0]?.order ?? 0 + 1) : 1;

      // Create new question
      const questionResult = await db
        .insert(questions)
        .values({
          ...questionData,
          quizId,
          order: nextOrder,
        })
        .returning();

      if (questionResult.length === 0) {
        throwApiError(500, "Failed to create question");
      }

      const newQuestion = questionResult[0];
      if (!newQuestion || !newQuestion.id) {
        throwApiError(500, "Failed to create question properly");
      }

      // Create options for the question
      const optionsData = options.map((option) => ({
        ...option,
        questionId: newQuestion!.id,
      }));

      const createdOptions = await db
        .insert(answerOptions)
        .values(optionsData)
        .returning();

      return c.superjson(
        {
          message: "Question added successfully",
          data: {
            ...newQuestion,
            options: createdOptions,
          },
        },
        201
      );
    }),

  /** ========================================
   * DELETE QUESTION FROM QUIZ
   ======================================== */
  deleteQuestion: privateProcedure
    .input(z.object({ questionId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { questionId } = input;

      // Check if question exists
      const questionResult = await db
        .select()
        .from(questions)
        .where(eq(questions.id, questionId))
        .execute();

      if (questionResult.length === 0) {
        throwApiError(404, "Question not found");
      }

      const existingQuestion = questionResult[0];
      if (!existingQuestion) {
        throwApiError(404, "Question not found");
      }

      const quizId = existingQuestion?.quizId as string;
      if (!quizId) {
        throwApiError(500, "Question has no associated quiz");
      }

      // Delete the question (options will be deleted by cascade)
      await db.delete(questions).where(eq(questions.id, questionId));

      // Reorder remaining questions
      const remainingQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.quizId, quizId))
        .orderBy(questions.order)
        .execute();

      // Update order for each remaining question
      await Promise.all(
        remainingQuestions.map((question, index) =>
          db
            .update(questions)
            .set({ order: index + 1 })
            .where(eq(questions.id, question.id))
        )
      );

      return c.superjson(
        {
          message: "Question deleted successfully",
        },
        200
      );
    }),
});
