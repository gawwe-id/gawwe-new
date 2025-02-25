import { languageClasses } from "@/server/db/schema";
import {
  createLanguageClassesSchema,
  insertLanguageClassesSchema,
  selectLanguageClassesSchema,
} from "@/server/db/schema/languageClasses";
import { and, eq } from "drizzle-orm";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { z } from "zod";
import { throwApiError } from "@/utils/api-error";

export const languageClassesRouter = j.router({
  /** ========================================
   * CREATE LANGUAGE CLASS
   ======================================== */
  create: privateProcedure
    .input(createLanguageClassesSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      try {
        const [language] = await db
          .insert(languageClasses)
          .values({
            ...input,
            userId: user.id as string,
          })
          .returning();

        return c.superjson(
          {
            message: "Bahasa berhasil dibuat",
            data: language,
          },
          201
        );
      } catch (error) {
        throwApiError(500, "Gagal membuat bahasa", "LANGUAGE_CREATE_ERROR");
      }
    }),

  /** ========================================
   * GET ALL LANGUAGE CLASSES
   ======================================== */
  list: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    try {
      const languages = await db.select().from(languageClasses).execute();

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar bahasa",
          data: languages,
        },
        200
      );
    } catch (error) {
      throwApiError(
        500,
        "Gagal mendapatkan daftar bahasa",
        "LANGUAGE_LIST_ERROR"
      );
    }
  }),

  /** ========================================
   * GET MY LANGUAGE CLASSES (For agency)
   ======================================== */
  myLanguages: privateProcedure.query(async ({ c, ctx }) => {
    const { db, user } = ctx;

    try {
      const languages = await db
        .select()
        .from(languageClasses)
        .where(eq(languageClasses.userId, user.id as string))
        .execute();

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar bahasa",
          data: languages,
        },
        200
      );
    } catch (error) {
      throwApiError(
        500,
        "Gagal mendapatkan daftar bahasa",
        "MY_LANGUAGE_LIST_ERROR"
      );
    }
  }),

  /** ========================================
   * GET LANGUAGE CLASS BY ID
   ======================================== */
  single: publicProcedure
    .input(z.object({ languageId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { languageId } = input;

      try {
        const [language] = await db
          .select()
          .from(languageClasses)
          .where(eq(languageClasses.id, languageId))
          .execute();

        if (!language) {
          throwApiError(404, "Bahasa tidak ditemukan", "LANGUAGE_NOT_FOUND");
        }

        return c.superjson(
          {
            message: "Berhasil mendapatkan detail bahasa",
            data: language,
          },
          200
        );
      } catch (error) {
        if (error instanceof Error && error.message === "LANGUAGE_NOT_FOUND") {
          throw error;
        }
        throwApiError(
          500,
          "Gagal mendapatkan detail bahasa",
          "LANGUAGE_DETAIL_ERROR"
        );
      }
    }),

  /** ========================================
   * UPDATE LANGUAGE CLASS
   ======================================== */
  update: privateProcedure
    .input(
      z.object({
        languageId: z.string(),
        updateLanguage: z.object({
          languageName: z.string().optional(),
          level: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { languageId, updateLanguage } = input;

      try {
        // Check if language exists and belongs to the user
        const [existingLanguage] = await db
          .select()
          .from(languageClasses)
          .where(
            and(
              eq(languageClasses.id, languageId),
              eq(languageClasses.userId, user.id as string)
            )
          )
          .execute();

        if (!existingLanguage) {
          throwApiError(
            404,
            "Bahasa tidak ditemukan atau Anda tidak memiliki akses",
            "LANGUAGE_NOT_FOUND"
          );
        }

        const [language] = await db
          .update(languageClasses)
          .set(updateLanguage)
          .where(eq(languageClasses.id, languageId))
          .returning();

        return c.superjson(
          {
            message: "Bahasa berhasil diperbarui",
            data: language,
          },
          200
        );
      } catch (error) {
        if (error instanceof Error && error.message === "LANGUAGE_NOT_FOUND") {
          throw error;
        }
        throwApiError(500, "Gagal memperbarui bahasa", "LANGUAGE_UPDATE_ERROR");
      }
    }),

  /** ========================================
   * DELETE LANGUAGE CLASS
   ======================================== */
  delete: privateProcedure
    .input(z.object({ languageId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { languageId } = input;

      try {
        // Check if language exists and belongs to the user
        const [existingLanguage] = await db
          .select()
          .from(languageClasses)
          .where(
            and(
              eq(languageClasses.id, languageId),
              eq(languageClasses.userId, user.id as string)
            )
          )
          .execute();

        if (!existingLanguage) {
          throwApiError(
            404,
            "Bahasa tidak ditemukan atau Anda tidak memiliki akses",
            "LANGUAGE_NOT_FOUND"
          );
        }

        await db
          .delete(languageClasses)
          .where(eq(languageClasses.id, languageId))
          .execute();

        return c.superjson(
          {
            message: "Bahasa berhasil dihapus",
            data: null,
          },
          200
        );
      } catch (error) {
        if (error instanceof Error && error.message === "LANGUAGE_NOT_FOUND") {
          throw error;
        }
        throwApiError(500, "Gagal menghapus bahasa", "LANGUAGE_DELETE_ERROR");
      }
    }),
});
