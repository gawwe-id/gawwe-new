import { classes, languageClasses } from "@/server/db/schema";
import {
  insertClassSchema,
  selectClassSchema,
  updateClassSchema,
} from "@/server/db/schema/classes";
import { and, eq } from "drizzle-orm";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { z } from "zod";
import { throwApiError } from "@/utils/api-error";

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

    return c.superjson(
      {
        message: "Berhasil mendapatkan daftar kelas",
        data: allClasses,
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

      const classesByLanguage = await db
        .select()
        .from(classes)
        .where(eq(classes.languageClassId, languageClassId))
        .execute();

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar kelas",
          data: classesByLanguage,
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
