import { languages } from "@/server/db/schema";
import {
  createLanguageSchema,
  selectLanguageSchema,
  updateLanguageSchema,
} from "@/server/db/schema/languages";
import { eq } from "drizzle-orm";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { z } from "zod";

export const languagesRouter = j.router({
  /** ========================================
   * CREATE LANGUAGE
   ======================================== */
  create: privateProcedure
    .input(createLanguageSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;

      const [language] = await db.insert(languages).values(input).returning();

      return c.superjson(
        {
          message: "Berhasil membuat bahasa baru",
          data: language,
        },
        200
      );
    }),

  /** ========================================
   * GET ALL LANGUAGES
   ======================================== */
  list: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;
    const allLanguages = await db
      .select()
      .from(languages)
      .where(eq(languages.isActive, true))
      .execute();

    return c.superjson(
      {
        message: "Success",
        data: allLanguages,
      },
      200
    );
  }),

  /** ========================================
   * GET LANGUAGE BY ID
   ======================================== */
  single: publicProcedure
    .input(z.object({ languageId: z.string() }))
    .outgoing(
      z.object({
        message: z.string(),
        data: selectLanguageSchema.nullable(),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { languageId } = input;

      const [language] = await db
        .select()
        .from(languages)
        .where(eq(languages.id, languageId))
        .execute();

      return c.superjson(
        {
          message: "Success",
          data: language,
        },
        200
      );
    }),

  /** ========================================
   * UPDATE LANGUAGE
   ======================================== */
  update: privateProcedure
    .input(
      z.object({
        languageId: z.string(),
        updateLanguage: updateLanguageSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { languageId, updateLanguage } = input;

      const [language] = await db
        .update(languages)
        .set(updateLanguage)
        .where(eq(languages.id, languageId))
        .returning();

      return c.superjson(
        {
          message: "Berhasil update bahasa",
          data: language,
        },
        200
      );
    }),

  /** ========================================
   * DELETE LANGUAGE (SOFT DELETE)
   ======================================== */
  softDelete: privateProcedure
    .input(z.object({ languageId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { languageId } = input;

      const [language] = await db
        .update(languages)
        .set({ isActive: false })
        .where(eq(languages.id, languageId))
        .returning();

      return c.superjson({
        message: "Berhasil menonaktifkan bahasa",
        data: language,
      });
    }),

  /** ========================================
   * HARD DELETE LANGUAGE
   ======================================== */
  delete: privateProcedure
    .input(z.object({ languageId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { languageId } = input;

      await db.delete(languages).where(eq(languages.id, languageId)).execute();

      return c.superjson({
        message: "Berhasil menghapus bahasa",
        data: null,
      });
    }),
});
