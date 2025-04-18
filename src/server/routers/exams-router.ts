import { exams, calendars, classes } from "@/server/db/schema";
import { throwApiError } from "@/utils/api-error";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { insertExamSchema, updateExamSchema } from "../db/schema/exams";

// Define input schemas
const ExamIdInput = z.object({ examId: z.string() });
const ClassIdInput = z.object({ classId: z.string() });
const CalendarIdInput = z.object({ calendarId: z.string() });

export const examsRouter = j.router({
  /** ========================================
   * CREATE EXAM
   ======================================== */
  create: privateProcedure
    .input(insertExamSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;

      // Check if the class exists if classId is provided
      if (input.classId) {
        const [classExists] = await db
          .select()
          .from(classes)
          .where(eq(classes.id, input.classId))
          .execute();

        if (!classExists) {
          throwApiError(404, "Class not found");
        }
      }

      // Check if the calendar exists if calendarId is provided
      if (input.calendarId) {
        const [calendarExists] = await db
          .select()
          .from(calendars)
          .where(eq(calendars.id, input.calendarId))
          .execute();

        if (!calendarExists) {
          throwApiError(404, "Calendar not found");
        }
      }

      // Create the exam
      const [newExam] = await db.insert(exams).values(input).returning();

      return c.superjson(
        {
          message: "Exam created successfully",
          data: newExam,
        },
        201
      );
    }),

  /** ========================================
   * GET EXAM BY ID
   ======================================== */
  byId: publicProcedure.input(ExamIdInput).query(async ({ c, ctx, input }) => {
    const { db } = ctx;
    const { examId } = input;

    // Get the exam
    const [exam] = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .execute();

    if (!exam) {
      throwApiError(404, "Exam not found");
    }

    return c.superjson(
      {
        message: "Exam retrieved successfully",
        data: exam,
      },
      200
    );
  }),

  /** ========================================
   * LIST ALL EXAMS
   ======================================== */
  list: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    // Get all exams
    const examsList = await db.select().from(exams).execute();

    return c.superjson(
      {
        message: "Exams retrieved successfully",
        data: examsList,
      },
      200
    );
  }),

  /** ========================================
   * LIST EXAMS BY CLASS ID
   ======================================== */
  byClassId: publicProcedure
    .input(ClassIdInput)
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { classId } = input;

      // Check if the class exists
      const [classExists] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId))
        .execute();

      if (!classExists) {
        throwApiError(404, "Class not found");
      }

      // Get all exams for this class
      const examsList = await db
        .select()
        .from(exams)
        .where(eq(exams.classId, classId))
        .execute();

      return c.superjson(
        {
          message: "Exams for class retrieved successfully",
          data: examsList,
        },
        200
      );
    }),

  /** ========================================
   * LIST EXAMS BY CALENDAR ID
   ======================================== */
  byCalendarId: publicProcedure
    .input(CalendarIdInput)
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { calendarId } = input;

      // Check if the calendar exists
      const [calendarExists] = await db
        .select()
        .from(calendars)
        .where(eq(calendars.id, calendarId))
        .execute();

      if (!calendarExists) {
        throwApiError(404, "Calendar not found");
      }

      // Get all exams for this calendar
      const examsList = await db
        .select()
        .from(exams)
        .where(eq(exams.calendarId, calendarId))
        .execute();

      return c.superjson(
        {
          message: "Exams for calendar retrieved successfully",
          data: examsList,
        },
        200
      );
    }),

  /** ========================================
   * UPDATE EXAM
   ======================================== */
  update: privateProcedure
    .input(
      z.object({
        examId: z.string(),
        data: updateExamSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { examId, data } = input;

      // Check if the exam exists
      const [existingExam] = await db
        .select()
        .from(exams)
        .where(eq(exams.id, examId))
        .execute();

      if (!existingExam) {
        throwApiError(404, "Exam not found");
      }

      // Check if the class exists if classId is provided
      if (data.classId) {
        const [classExists] = await db
          .select()
          .from(classes)
          .where(eq(classes.id, data.classId))
          .execute();

        if (!classExists) {
          throwApiError(404, "Class not found");
        }
      }

      // Check if the calendar exists if calendarId is provided
      if (data.calendarId) {
        const [calendarExists] = await db
          .select()
          .from(calendars)
          .where(eq(calendars.id, data.calendarId))
          .execute();

        if (!calendarExists) {
          throwApiError(404, "Calendar not found");
        }
      }

      // Update the exam
      const [updatedExam] = await db
        .update(exams)
        .set(data)
        .where(eq(exams.id, examId))
        .returning();

      return c.superjson(
        {
          message: "Exam updated successfully",
          data: updatedExam,
        },
        200
      );
    }),

  /** ========================================
   * DELETE EXAM
   ======================================== */
  delete: privateProcedure
    .input(ExamIdInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { examId } = input;

      // Check if the exam exists
      const [existingExam] = await db
        .select()
        .from(exams)
        .where(eq(exams.id, examId))
        .execute();

      if (!existingExam) {
        throwApiError(404, "Exam not found");
      }

      // Delete the exam
      await db.delete(exams).where(eq(exams.id, examId)).execute();

      return c.superjson(
        {
          message: "Exam deleted successfully",
          data: {
            deletedExamId: examId,
          },
        },
        200
      );
    }),

  /** ========================================
   * COUNT EXAMS BY CLASS ID
   ======================================== */
  countByClassId: publicProcedure
    .input(ClassIdInput)
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { classId } = input;

      // Check if the class exists
      const [classExists] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId))
        .execute();

      if (!classExists) {
        throwApiError(404, "Class not found");
      }

      // Count exams for this class
      const [examCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(exams)
        .where(eq(exams.classId, classId))
        .execute();

      return c.superjson(
        {
          message: "Exam count retrieved successfully",
          data: {
            classId,
            count: Number(examCount?.count || 0),
          },
        },
        200
      );
    }),

  /** ========================================
   * DELETE ALL EXAMS FOR A CLASS
   ======================================== */
  deleteByClassId: privateProcedure
    .input(ClassIdInput)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { classId } = input;

      // Check if the class exists
      const [classExists] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId))
        .execute();

      if (!classExists) {
        throwApiError(404, "Class not found");
      }

      // Delete all exams for this class
      const result = await db
        .delete(exams)
        .where(eq(exams.classId, classId))
        .returning();

      return c.superjson(
        {
          message: "All exams for class deleted successfully",
          data: {
            classId,
            deletedCount: result.length,
          },
        },
        200
      );
    }),

  /** ========================================
   * GET UPCOMING EXAMS
   ======================================== */
  upcoming: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    const now = new Date();

    // Get all exams with exam date in the future
    const upcomingExams = await db
      .select()
      .from(exams)
      .where(sql`${exams.examDate} > ${now}`)
      .orderBy(exams.examDate)
      .execute();

    return c.superjson(
      {
        message: "Upcoming exams retrieved successfully",
        data: upcomingExams,
      },
      200
    );
  }),
});
