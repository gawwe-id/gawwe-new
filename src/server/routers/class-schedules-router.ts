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
   * GET ALL CLASS SCHEDULES
   ======================================== */
  list: privateProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    const allSchedules = await db
      .select({
        schedule: classSchedules,
        class: classes,
      })
      .from(classSchedules)
      .leftJoin(classes, eq(classSchedules.classId, classes.id))
      .execute();

    const formattedSchedules = allSchedules.map(({ schedule, class: cls }) => ({
      ...schedule,
      class: cls,
    }));

    return c.superjson(
      {
        message: "Berhasil mendapatkan daftar jadwal kelas",
        data: formattedSchedules,
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
      let classId = input.classId;

      try {
        const parsed = JSON.parse(classId);
        if (parsed && typeof parsed === "object" && parsed.json) {
          classId = parsed.json;
        }
      } catch (e) {
        // If it's not valid JSON, just use it as is
      }

      // Use a safer approach for the ORDER BY clause
      const dayOrder = {
        [ScheduleDay.SENIN]: 1,
        [ScheduleDay.SELASA]: 2,
        [ScheduleDay.RABU]: 3,
        [ScheduleDay.KAMIS]: 4,
        [ScheduleDay.JUMAT]: 5,
        [ScheduleDay.SABTU]: 6,
        [ScheduleDay.MINGGU]: 7,
      };

      // First fetch the schedules without the complex ORDER BY
      const schedules = await db
        .select()
        .from(classSchedules)
        .where(eq(classSchedules.classId, classId))
        .execute();

      // Then sort them in JavaScript
      const sortedSchedules = schedules.sort((a, b) => {
        const orderA = dayOrder[a.day as ScheduleDay] || 8;
        const orderB = dayOrder[b.day as ScheduleDay] || 8;
        return orderA - orderB;
      });

      return c.superjson(
        {
          message: "Berhasil mendapatkan jadwal",
          data: sortedSchedules,
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
