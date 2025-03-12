import {
  classes,
  classSchedules,
  languageClassEnrollments,
  languageClasses,
} from "@/server/db/schema";
import {
  insertClassSchema,
  selectClassSchema,
  updateClassSchema,
} from "@/server/db/schema/classes";
import { and, eq, inArray } from "drizzle-orm";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { z } from "zod";
import { throwApiError } from "@/utils/api-error";
import { ClassSchedule } from "../db/schema/classSchedules";

export const classesRouter = j.router({
  /** ========================================
   * CREATE CLASS
   ======================================== */
  create: privateProcedure
    .input(insertClassSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      // Verify the language class belongs to the user
      const [languageClass] = await db
        .select()
        .from(languageClasses)
        .where(
          and(
            eq(languageClasses.id, input.languageClassId),
            eq(languageClasses.userId, user.id as string)
          )
        )
        .execute();

      if (!languageClass) {
        throwApiError(
          404,
          "Bahasa tidak ditemukan atau Anda tidak memiliki akses",
          "LANGUAGE_NOT_FOUND"
        );
      }

      const [cls] = await db.insert(classes).values(input).returning();

      return c.superjson(
        {
          message: "Kelas berhasil dibuat",
          data: cls,
        },
        201
      );
    }),

  /** ========================================
   * GET ALL CLASSES
   ======================================== */
  list: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    const allClasses = await db.select().from(classes).execute();

    // Get schedules for all classes in a single query
    const schedulesResult = await db
      .select()
      .from(classSchedules)
      .where(
        inArray(
          classSchedules.classId,
          allClasses.map((cls) => cls.id)
        )
      )
      .execute();

    // Map schedules to their classes
    const classesWithSchedules = allClasses.map((cls) => {
      const classSchedules = schedulesResult.filter(
        (schedule) => schedule.classId === cls.id
      );

      return {
        ...cls,
        schedules: classSchedules,
      };
    });

    return c.superjson(
      {
        message: "Berhasil mendapatkan daftar kelas",
        data: classesWithSchedules,
      },
      200
    );
  }),

  /** ========================================
   * GET CLASSES BY USER ID
   ======================================== */
  byUserId: privateProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      // Use provided userId or default to authenticated user
      const userId = input.userId || (user.id as string);
      const userRole = user.role;

      // Different query logic based on user role
      let userClasses: any[] = [];

      if (userRole === "agency") {
        // For agency users: Find classes for language classes they own
        const ownedLanguageClasses = await db
          .select()
          .from(languageClasses)
          .where(eq(languageClasses.userId, userId))
          .execute();

        if (ownedLanguageClasses.length === 0) {
          return c.superjson(
            {
              message: "Berhasil mendapatkan daftar kelas",
              data: [],
            },
            200
          );
        }

        const languageClassIds = ownedLanguageClasses.map((lc) => lc.id);

        userClasses = await db
          .select()
          .from(classes)
          .where(inArray(classes.languageClassId, languageClassIds))
          .execute();
      } else {
        // For participant users: Find classes they're enrolled in
        const enrollments = await db
          .select({
            enrollment: languageClassEnrollments,
            languageClass: languageClasses,
          })
          .from(languageClassEnrollments)
          .leftJoin(
            languageClasses,
            eq(languageClassEnrollments.classId, languageClasses.id)
          )
          .where(eq(languageClassEnrollments.userId, userId))
          .execute();

        if (enrollments.length === 0) {
          return c.superjson(
            {
              message: "Berhasil mendapatkan daftar kelas",
              data: [],
            },
            200
          );
        }

        const languageClassIds = enrollments.map((e) => e.languageClass?.id);

        userClasses = await db
          .select()
          .from(classes)
          .where(inArray(classes.languageClassId, languageClassIds as string[]))
          .execute();
      }

      // If no classes found
      if (userClasses.length === 0) {
        return c.superjson(
          {
            message: "Berhasil mendapatkan daftar kelas",
            data: [],
          },
          200
        );
      }

      // Get schedules for these classes
      const classIds = userClasses.map((cls) => cls.id);
      const schedules = await db
        .select()
        .from(classSchedules)
        .where(inArray(classSchedules.classId, classIds))
        .execute();

      // Organize schedules by class id
      const schedulesByClassId: Record<string, typeof schedules> = {};

      for (const schedule of schedules) {
        if (!schedulesByClassId[schedule.classId]) {
          schedulesByClassId[schedule.classId] = [];
        }
        schedulesByClassId[schedule.classId]!.push(schedule);
      }

      // Combine classes with their schedules
      const classesWithSchedules = userClasses.map((cls) => ({
        ...cls,
        schedules: schedulesByClassId[cls.id] || [],
      }));

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar kelas pengguna",
          data: classesWithSchedules,
        },
        200
      );
    }),

  /** ========================================
   * GET CLASS BY ID
   ======================================== */
  single: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { classId } = input;

      const [cls] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId))
        .execute();

      if (!cls) {
        throwApiError(404, "Kelas tidak ditemukan", "CLASS_NOT_FOUND");
      }

      return c.superjson(
        {
          message: "Berhasil mendapatkan detail kelas",
          data: cls,
        },
        200
      );
    }),

  /** ========================================
   * GET CLASSES BY LANGUAGE ID
   ======================================== */
  byLanguage: publicProcedure
    .input(z.object({ languageClassId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { languageClassId } = input;

      // Get all classes for the language
      const classesList = await db
        .select()
        .from(classes)
        .where(eq(classes.languageClassId, languageClassId))
        .execute();

      if (classesList.length === 0) {
        return c.superjson(
          {
            message: "Berhasil mendapatkan daftar kelas",
            data: [],
          },
          200
        );
      }

      // Get all schedules for these classes in a single query
      const classIds = classesList.map((cls) => cls.id);
      const schedules = await db
        .select()
        .from(classSchedules)
        .where(inArray(classSchedules.classId, classIds))
        .execute();

      // Organize schedules by class id
      const schedulesByClassId: Record<string, typeof schedules> = {};

      for (const schedule of schedules) {
        if (!schedulesByClassId[schedule.classId]) {
          schedulesByClassId[schedule.classId] = [];
        }
        schedulesByClassId[schedule?.classId]!.push(schedule);
      }

      // Combine classes with their schedules
      const classesWithSchedules = classesList.map((cls) => ({
        ...cls,
        schedules: schedulesByClassId[cls.id] || [],
      }));

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar kelas dengan jadwal",
          data: classesWithSchedules,
        },
        200
      );
    }),

  /** ========================================
   * UPDATE CLASS
   ======================================== */
  update: privateProcedure
    .input(
      z.object({
        classId: z.string(),
        updateClass: updateClassSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { classId, updateClass } = input;

      // Verify the class exists and belongs to a language owned by the user
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

      const [updatedClass] = await db
        .update(classes)
        .set(updateClass)
        .where(eq(classes.id, classId))
        .returning();

      return c.superjson(
        {
          message: "Kelas berhasil diperbarui",
          data: updatedClass,
        },
        200
      );
    }),

  /** ========================================
   * DELETE CLASS
   ======================================== */
  delete: privateProcedure
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

      await db.delete(classes).where(eq(classes.id, classId)).execute();

      return c.superjson(
        {
          message: "Kelas berhasil dihapus",
          data: null,
        },
        200
      );
    }),
});
