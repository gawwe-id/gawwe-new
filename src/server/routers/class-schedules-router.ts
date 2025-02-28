import { classSchedules, classes, languageClasses } from "@/server/db/schema";
import {
  insertClassScheduleSchema,
  updateClassScheduleSchema,
  ScheduleDay,
} from "@/server/db/schema/classSchedules";
import { and, eq, sql } from "drizzle-orm";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { z } from "zod";
import { throwApiError } from "@/utils/api-error";

export const classSchedulesRouter = j.router({
  /** ========================================
   * CREATE CLASS SCHEDULE
   ======================================== */
  create: privateProcedure
    .input(insertClassScheduleSchema.omit({ id: true }))
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      const [cls] = await db
        .select({
          class: classes,
          language: languageClasses,
        })
        .from(classes)
        .leftJoin(
          languageClasses,
          eq(classes.languageClassId, languageClasses.id)
        )
        .where(
          and(
            eq(classes.id, input.classId),
            eq(languageClasses.userId, user.id as string)
          )
        )
        .execute();

      if (!cls) {
        throwApiError(
          404,
          "Kelas tidak ditemukan atau Anda tidak memiliki akses",
          "CLASS_NOT_FOUND"
        );
      }

      // Check if there's already a schedule for this day
      const [existingSchedule] = await db
        .select()
        .from(classSchedules)
        .where(
          and(
            eq(classSchedules.classId, input.classId),
            eq(classSchedules.day, input.day)
          )
        )
        .execute();

      if (existingSchedule) {
        throwApiError(
          400,
          `Jadwal untuk hari ${input.day} sudah ada`,
          "SCHEDULE_EXISTS"
        );
      }

      const [schedule] = await db
        .insert(classSchedules)
        .values(input)
        .returning();

      return c.superjson(
        {
          message: "Jadwal berhasil dibuat",
          data: schedule,
        },
        200
      );
    }),

  /** ========================================
   * GET SCHEDULES BY CLASS ID
   ======================================== */
  byClass: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { classId } = input;

      const schedules = await db
        .select()
        .from(classSchedules)
        .where(eq(classSchedules.classId, classId))
        .orderBy(
          sql`CASE 
              WHEN ${classSchedules.day} = '${ScheduleDay.MONDAY}' THEN 1 
              WHEN ${classSchedules.day} = '${ScheduleDay.TUESDAY}' THEN 2 
              WHEN ${classSchedules.day} = '${ScheduleDay.WEDNESDAY}' THEN 3 
              WHEN ${classSchedules.day} = '${ScheduleDay.THURSDAY}' THEN 4 
              WHEN ${classSchedules.day} = '${ScheduleDay.FRIDAY}' THEN 5 
              WHEN ${classSchedules.day} = '${ScheduleDay.SATURDAY}' THEN 6 
              WHEN ${classSchedules.day} = '${ScheduleDay.SUNDAY}' THEN 7 
              ELSE 8 END`
        )
        .execute();

      return c.superjson(
        {
          message: "Berhasil mendapatkan jadwal",
          data: schedules,
        },
        200
      );
    }),

  /** ========================================
   * UPDATE CLASS SCHEDULE
   ======================================== */
  update: privateProcedure
    .input(
      z.object({
        scheduleId: z.string(),
        updateSchedule: updateClassScheduleSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { scheduleId, updateSchedule } = input;

      const [schedule] = await db
        .select({
          schedule: classSchedules,
          class: classes,
          language: languageClasses,
        })
        .from(classSchedules)
        .leftJoin(classes, eq(classSchedules.classId, classes.id))
        .leftJoin(
          languageClasses,
          eq(classes.languageClassId, languageClasses.id)
        )
        .where(
          and(
            eq(classSchedules.id, scheduleId),
            eq(languageClasses.userId, user.id as string)
          )
        )
        .execute();

      if (!schedule) {
        throwApiError(
          404,
          "Jadwal tidak ditemukan atau Anda tidak memiliki akses",
          "SCHEDULE_NOT_FOUND"
        );
      }

      const [updatedSchedule] = await db
        .update(classSchedules)
        .set(updateSchedule)
        .where(eq(classSchedules.id, scheduleId))
        .returning();

      return c.superjson(
        {
          message: "Jadwal berhasil diperbarui",
          data: updatedSchedule,
        },
        200
      );
    }),

  /** ========================================
   * DELETE CLASS SCHEDULE
   ======================================== */
  delete: privateProcedure
    .input(z.object({ scheduleId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { scheduleId } = input;

      const [schedule] = await db
        .select({
          schedule: classSchedules,
          class: classes,
          language: languageClasses,
        })
        .from(classSchedules)
        .leftJoin(classes, eq(classSchedules.classId, classes.id))
        .leftJoin(
          languageClasses,
          eq(classes.languageClassId, languageClasses.id)
        )
        .where(
          and(
            eq(classSchedules.id, scheduleId),
            eq(languageClasses.userId, user.id as string)
          )
        )
        .execute();

      if (!schedule) {
        throwApiError(
          404,
          "Jadwal tidak ditemukan atau Anda tidak memiliki akses",
          "SCHEDULE_NOT_FOUND"
        );
      }

      await db
        .delete(classSchedules)
        .where(eq(classSchedules.id, scheduleId))
        .execute();

      return c.superjson(
        {
          message: "Jadwal berhasil dihapus",
          data: null,
        },
        200
      );
    }),

  /** ========================================
   * DELETE ALL SCHEDULES FOR A CLASS
   ======================================== */
  deleteAllForClass: privateProcedure
    .input(z.object({ classId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { classId } = input;

      const [cls] = await db
        .select({
          class: classes,
          language: languageClasses,
        })
        .from(classes)
        .leftJoin(
          languageClasses,
          eq(classes.languageClassId, languageClasses.id)
        )
        .where(
          and(
            eq(classes.id, classId),
            eq(languageClasses.userId, user.id as string)
          )
        )
        .execute();

      if (!cls) {
        throwApiError(
          404,
          "Kelas tidak ditemukan atau Anda tidak memiliki akses",
          "CLASS_NOT_FOUND"
        );
      }

      await db
        .delete(classSchedules)
        .where(eq(classSchedules.classId, classId))
        .execute();

      return c.superjson(
        {
          message: "Semua jadwal berhasil dihapus",
          data: null,
        },
        200
      );
    }),
});
