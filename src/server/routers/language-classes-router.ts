import { classes, languageClasses, languages } from "@/server/db/schema";
import {
  createLanguageClassesSchema,
  selectLanguageClassesSchema,
  updateLanguageClassesSchema,
} from "@/server/db/schema/languageClasses";
import { eq } from "drizzle-orm";
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

      // Check if language exists
      const [language] = await db
        .select()
        .from(languages)
        .where(eq(languages.id, input.languageId))
        .execute();

      if (!language) {
        throwApiError(404, "Bahasa tidak ditemukan", "LANGUAGE_NOT_FOUND");
      }

      const [languageClass] = await db
        .insert(languageClasses)
        .values({
          ...input,
          userId: user.id as string,
        })
        .returning();

      return c.superjson(
        {
          message: "Berhasil membuat kelas bahasa",
          data: languageClass,
        },
        200
      );
    }),

  /** ========================================
   * GET ALL LANGUAGE CLASSES (WITH LANGUAGE INFO)
   ======================================== */
  list: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;

    const results = await db
      .select({
        languageClass: languageClasses,
        language: languages,
      })
      .from(languageClasses)
      .leftJoin(languages, eq(languageClasses.languageId, languages.id))
      .execute();

    // Transform results to include language info within each class
    const allLanguageClasses = results.map((result) => ({
      ...result.languageClass,
      language: result.language,
    }));

    return c.superjson(
      {
        message: "Success",
        data: allLanguageClasses,
      },
      200
    );
  }),

  /** ========================================
   * GET USER'S LANGUAGE CLASSES
   ======================================== */
  myClasses: privateProcedure.query(async ({ c, ctx }) => {
    const { db, user } = ctx;

    // First get language classes with language info
    const results = await db
      .select({
        languageClass: languageClasses,
        language: languages,
      })
      .from(languageClasses)
      .leftJoin(languages, eq(languageClasses.languageId, languages.id))
      .where(eq(languageClasses.userId, user.id as string))
      .execute();

    // Then get classes associated with each language class
    const userClassesPromises = results.map(async (result) => {
      const classesForLanguage = await db
        .select()
        .from(classes)
        .where(eq(classes.languageClassId, result.languageClass.id))
        .execute();

      return {
        ...result.languageClass,
        language: result.language,
        classes: classesForLanguage,
      };
    });

    const userClasses = await Promise.all(userClassesPromises);

    return c.superjson(
      {
        message: "Success",
        data: userClasses,
      },
      200
    );
  }),

  /** ========================================
   * GET LANGUAGE CLASS BY ID
   ======================================== */
  single: publicProcedure
    .input(z.object({ languageClassId: z.string() }))
    .outgoing(
      z.object({
        message: z.string(),
        data: z.object({
          languageClass: selectLanguageClassesSchema.nullable(),
          language: z.any(),
        }),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { languageClassId } = input;

      const [result] = await db
        .select({
          languageClass: languageClasses,
          language: languages,
        })
        .from(languageClasses)
        .leftJoin(languages, eq(languageClasses.languageId, languages.id))
        .where(eq(languageClasses.id, languageClassId))
        .limit(1)
        .execute();

      const languageClassWithLanguage = result
        ? {
            ...result.languageClass,
            language: result.language,
          }
        : null;

      if (!languageClassWithLanguage) {
        return c.superjson(
          {
            message: "Language class not found",
            data: {
              languageClass: null,
              language: null,
            },
          },
          404
        );
      }

      return c.superjson(
        {
          message: "Success",
          data: {
            languageClass: languageClassWithLanguage,
            language: languageClassWithLanguage.language,
          },
        },
        200
      );
    }),

  /** ========================================
   * UPDATE LANGUAGE CLASS
   ======================================== */
  update: privateProcedure
    .input(
      z.object({
        languageClassId: z.string(),
        updateLanguageClass: updateLanguageClassesSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { languageClassId, updateLanguageClass } = input;

      // Check if user owns this language class
      const [existingClass] = await db
        .select()
        .from(languageClasses)
        .where(eq(languageClasses.id, languageClassId))
        .execute();

      if (!existingClass) {
        throwApiError(404, "Kelas bahasa tidak ditemukan", "CLASS_NOT_FOUND");
      }

      if (existingClass?.userId !== user.id) {
        throwApiError(
          403,
          "Tidak memiliki akses untuk mengubah kelas ini",
          "FORBIDDEN"
        );
      }

      // If changing language, verify the language exists
      if (updateLanguageClass.languageId) {
        const [language] = await db
          .select()
          .from(languages)
          .where(eq(languages.id, updateLanguageClass.languageId))
          .execute();

        if (!language) {
          throwApiError(404, "Bahasa tidak ditemukan", "LANGUAGE_NOT_FOUND");
        }
      }

      const [updatedClass] = await db
        .update(languageClasses)
        .set(updateLanguageClass)
        .where(eq(languageClasses.id, languageClassId))
        .returning();

      return c.superjson(
        {
          message: "Berhasil update kelas bahasa",
          data: updatedClass,
        },
        200
      );
    }),

  /** ========================================
   * DELETE LANGUAGE CLASS
   ======================================== */
  delete: privateProcedure
    .input(z.object({ languageClassId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { languageClassId } = input;

      // Check if user owns this language class
      const [existingClass] = await db
        .select()
        .from(languageClasses)
        .where(eq(languageClasses.id, languageClassId))
        .execute();

      if (!existingClass) {
        throwApiError(404, "Kelas bahasa tidak ditemukan", "CLASS_NOT_FOUND");
      }

      if (existingClass?.userId !== user.id) {
        throwApiError(
          403,
          "Tidak memiliki akses untuk menghapus kelas ini",
          "FORBIDDEN"
        );
      }

      await db
        .delete(languageClasses)
        .where(eq(languageClasses.id, languageClassId))
        .execute();

      return c.superjson({
        message: "Berhasil menghapus kelas bahasa",
        data: null,
      });
    }),
});
