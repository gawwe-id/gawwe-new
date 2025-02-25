import { classes, languageClasses } from "@/server/db/schema";
import {
  createClassSchema,
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
    .input(createClassSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      try {
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
      } catch (error) {
        if (error instanceof Error && error.message === "LANGUAGE_NOT_FOUND") {
          throw error;
        }
        throwApiError(500, "Gagal membuat kelas", "CLASS_CREATE_ERROR");
      }
    }),

  /** ========================================
   * GET ALL CLASSES
   ======================================== */
  list: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    try {
      const allClasses = await db.select().from(classes).execute();

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar kelas",
          data: allClasses,
        },
        200
      );
    } catch (error) {
      throwApiError(500, "Gagal mendapatkan daftar kelas", "CLASS_LIST_ERROR");
    }
  }),

  /** ========================================
   * GET CLASS BY ID
   ======================================== */
  single: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { classId } = input;

      try {
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
      } catch (error) {
        if (error instanceof Error && error.message === "CLASS_NOT_FOUND") {
          throw error;
        }
        throwApiError(
          500,
          "Gagal mendapatkan detail kelas",
          "CLASS_DETAIL_ERROR"
        );
      }
    }),

  /** ========================================
   * GET CLASSES BY LANGUAGE ID
   ======================================== */
  byLanguage: publicProcedure
    .input(z.object({ languageClassId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { languageClassId } = input;

      try {
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
      } catch (error) {
        throwApiError(
          500,
          "Gagal mendapatkan daftar kelas",
          "CLASS_BY_LANGUAGE_ERROR"
        );
      }
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

      try {
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
      } catch (error) {
        if (error instanceof Error && error.message === "CLASS_NOT_FOUND") {
          throw error;
        }
        throwApiError(500, "Gagal memperbarui kelas", "CLASS_UPDATE_ERROR");
      }
    }),

  /** ========================================
   * DELETE CLASS
   ======================================== */
  delete: privateProcedure
    .input(z.object({ classId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { classId } = input;

      try {
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

        await db.delete(classes).where(eq(classes.id, classId)).execute();

        return c.superjson(
          {
            message: "Kelas berhasil dihapus",
            data: null,
          },
          200
        );
      } catch (error) {
        if (error instanceof Error && error.message === "CLASS_NOT_FOUND") {
          throw error;
        }
        throwApiError(500, "Gagal menghapus kelas", "CLASS_DELETE_ERROR");
      }
    }),
});
