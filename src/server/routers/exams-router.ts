import { exams, calendars, classes } from "@/server/db/schema";
import { throwApiError } from "@/utils/api-error";
import { eq, sql, gte } from "drizzle-orm";
import { z } from "zod";
import { j, privateProcedure, publicProcedure } from "../jstack";
import dayjs from "dayjs";
import { insertExamSchema } from "../db/schema/exams";

// Define input schemas
const ExamIdInput = z.object({ examId: z.string() });
const ClassIdInput = z.object({ classId: z.string() });
const CalendarIdInput = z.object({ calendarId: z.string() });

// Define an enum for status validation
const ExamStatusEnum = z.enum([
  "draft",
  "published",
  "ongoing",
  "completed",
  "cancelled",
]);

const createExamInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  examDate: z.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM format
  endTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM format
  status: ExamStatusEnum.default("draft"),
  isOnline: z.boolean().default(false),
  link: z.string().optional(),
  classId: z.string().uuid().optional(),
  calendarId: z.string().uuid().optional(),
});

// Define a schema for the update exam input
const updateExamInputSchema = z.object({
  examId: z.string().uuid(),
  data: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    examDate: z.date().optional(),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .optional(), // HH:MM format
    endTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .optional(), // HH:MM format
    status: ExamStatusEnum.optional(),
    isOnline: z.boolean().optional(),
    link: z.string().optional(),
    classId: z.string().uuid().optional(),
    calendarId: z.string().uuid().optional(),
  }),
});

function combineDateTime(dateObj: Date | undefined, timeObj: Date): Date {
  // Create a new date object to avoid mutating the original
  const combinedDate = dateObj ? new Date(dateObj) : new Date();

  // Extract hours and minutes from the time Date object
  const hours = timeObj.getHours();
  const minutes = timeObj.getMinutes();

  // Set the time on the combined date
  combinedDate.setHours(hours, minutes, 0, 0);

  return combinedDate;
}

export const examsRouter = j.router({
  /** ========================================
   * CREATE EXAM
   ======================================== */
  create: privateProcedure
    .input(insertExamSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;

      // Log the input for debugging
      console.log("Original input:", JSON.stringify(input, null, 2));

      // Create a processed version of the input with proper timestamps
      const processedInput = {
        ...input,
        // Combine the examDate with the time components from startTime and endTime
        startTime: combineDateTime(input.examDate, input.startTime),
        endTime: combineDateTime(input.examDate, input.endTime),
      };

      console.log("Processed input:", JSON.stringify(processedInput, null, 2));

      // Check if the class exists if classId is provided
      if (processedInput.classId) {
        const [classExists] = await db
          .select()
          .from(classes)
          .where(eq(classes.id, processedInput.classId))
          .execute();

        if (!classExists) {
          throwApiError(404, "Class not found");
        }
      }

      // Check if the calendar exists if calendarId is provided
      if (processedInput.calendarId) {
        const [calendarExists] = await db
          .select()
          .from(calendars)
          .where(eq(calendars.id, processedInput.calendarId))
          .execute();

        if (!calendarExists) {
          throwApiError(404, "Calendar not found");
        }
      }

      // Validate that endTime is after startTime
      if (
        processedInput.startTime.getTime() >= processedInput.endTime.getTime()
      ) {
        throwApiError(400, "End time must be after start time");
      }

      // Create the exam
      try {
        const [newExam] = await db
          .insert(exams)
          .values(processedInput)
          .returning();

        return c.superjson(
          {
            message: "Exam created successfully",
            data: newExam,
          },
          201
        );
      } catch (error) {
        console.error("Error inserting exam:", error);
        throwApiError(500, "Failed to create exam");
      }
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
        data: updateExamInputSchema,
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

      // Create a processed version of the input
      const processedData: any = { ...data };

      // If updating both examDate and startTime, combine them
      if (data.data.examDate && data.data.startTime) {
        processedData.startTime = combineDateTime(
          data.data.examDate,
          data?.data?.startTime
        );
      }
      // If updating just startTime, use existing examDate
      else if (
        data.data.startTime &&
        !data.data.examDate &&
        existingExam?.examDate
      ) {
        processedData.startTime = combineDateTime(
          existingExam?.examDate,
          data.data.startTime
        );
      }

      // Same for endTime
      if (data.data.examDate && data.data.endTime) {
        processedData.endTime = combineDateTime(
          data.data.examDate,
          data.data.endTime
        );
      } else if (
        data.data.endTime &&
        !data.data.examDate &&
        existingExam?.examDate
      ) {
        processedData.endTime = combineDateTime(
          existingExam?.examDate,
          data.data.endTime
        );
      }

      // Check if the class exists if classId is provided
      if (processedData.classId) {
        const [classExists] = await db
          .select()
          .from(classes)
          .where(eq(classes.id, processedData.classId))
          .execute();

        if (!classExists) {
          throwApiError(404, "Class not found");
        }
      }

      // Check if the calendar exists if calendarId is provided
      if (processedData.calendarId) {
        const [calendarExists] = await db
          .select()
          .from(calendars)
          .where(eq(calendars.id, processedData.calendarId))
          .execute();

        if (!calendarExists) {
          throwApiError(404, "Calendar not found");
        }
      }

      // Validate that endTime is after startTime if both are being updated
      if (processedData.startTime && processedData.endTime) {
        if (
          processedData.startTime.getTime() >= processedData.endTime.getTime()
        ) {
          throwApiError(400, "End time must be after start time");
        }
      }
      // If only one time is being updated, check against existing value
      else if (processedData.startTime && existingExam?.endTime) {
        if (
          processedData.startTime.getTime() >=
          new Date(existingExam?.endTime).getTime()
        ) {
          throwApiError(400, "End time must be after start time");
        }
      } else if (processedData.endTime && existingExam?.startTime) {
        if (
          new Date(existingExam?.startTime).getTime() >=
          processedData.endTime.getTime()
        ) {
          throwApiError(400, "End time must be after start time");
        }
      }

      // Remove non-DB fields
      if (data.data.startTime) delete data.data.startTime;
      if (data.data.endTime) delete data.data.endTime;

      // Update the exam
      try {
        const [updatedExam] = await db
          .update(exams)
          .set(processedData)
          .where(eq(exams.id, examId))
          .returning();

        return c.superjson(
          {
            message: "Exam updated successfully",
            data: updatedExam,
          },
          200
        );
      } catch (error) {
        console.error("Error updating exam:", error);
        throwApiError(500, "Failed to update exam");
      }
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
  upcoming: publicProcedure
    .input(
      z
        .object({
          limit: z.number().optional().default(10),
          includeStatus: z.array(ExamStatusEnum).optional(),
        })
        .optional()
    )
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const limit = input?.limit || 10;
      const includeStatus = input?.includeStatus || ["published", "ongoing"];

      const now = new Date();

      // Get upcoming exams with specified statuses
      const upcomingExams = await db
        .select()
        .from(exams)
        .where(
          sql`${exams.examDate} > ${now} AND ${exams.status} IN (${includeStatus.join(",")})`
        )
        .orderBy(exams.examDate)
        .limit(limit)
        .execute();

      return c.superjson(
        {
          message: "Upcoming exams retrieved successfully",
          data: upcomingExams,
        },
        200
      );
    }),

  /** ========================================
   * GET EXAMS BY STATUS
   ======================================== */
  byStatus: publicProcedure
    .input(
      z.object({
        status: ExamStatusEnum,
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { status, limit } = input;

      // Get exams by status
      const examsList = await db
        .select()
        .from(exams)
        .where(eq(exams.status, status))
        .limit(limit)
        .execute();

      return c.superjson(
        {
          message: `${status} exams retrieved successfully`,
          data: examsList,
        },
        200
      );
    }),
});
