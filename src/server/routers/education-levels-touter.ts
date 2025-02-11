import { educationLevels } from "@/server/db/schema";
import {
  insertEducationLevelSchema,
  selectEducationLevelSchema,
  updateEducationLevelSchema,
} from "@/server/db/schema/educationLevels";
import { eq } from "drizzle-orm";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { z } from "zod";

export const educationLevelsRouter = j.router({
  /** ========================================
     * CREATE EDUCATION LEVEL
     ======================================== */
  create: publicProcedure
    .input(insertEducationLevelSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;

      const [level] = await db
        .insert(educationLevels)
        .values(input)
        .returning();

      return c.json(
        {
          message: "Berhasil membuat jenjang pendidikan",
          data: level,
        },
        200
      );
    }),

  /** ========================================
     * GET ALL EDUCATION LEVEL
     ======================================== */
  list: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;
    const levels = await db.select().from(educationLevels).execute();

    return c.json(
      {
        message: "Success",
        data: levels,
      },
      200
    );
  }),

  /** ========================================
     * GET EDUCATION LEVEL BY ID
     ======================================== */
  single: publicProcedure
    .input(z.object({ educationId: z.string() }))
    .outgoing(
      z.object({
        message: z.string(),
        data: selectEducationLevelSchema.nullable(),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { educationId } = input;

      const [level] = await db
        .select()
        .from(educationLevels)
        .where(eq(educationLevels.id, educationId))
        .execute();

      return c.json(
        {
          message: "Success",
          data: level,
        },
        200
      );
    }),

  /** ========================================
     * UPDATE EDUCATION LEVEL
     ======================================== */
  update: publicProcedure
    .input(
      z.object({
        educationId: z.string(),
        updateLevel: updateEducationLevelSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { educationId, updateLevel } = input;

      const [level] = await db
        .update(educationLevels)
        .set(updateLevel)
        .where(eq(educationLevels.id, educationId))
        .returning();

      return c.json(
        {
          message: "BErhasil update jenjang pendidikan",
          data: level,
        },
        200
      );
    }),

  /** ========================================
     * DELETE EDUCATION LEVEL
     ======================================== */
  delete: privateProcedure
    .input(z.object({ educationId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { educationId } = input;

      await db
        .delete(educationLevels)
        .where(eq(educationLevels.id, educationId))
        .execute();

      return c.json({
        message: "Berhasil menghapus jenjang pendidikan",
        data: null,
      });
    }),
});
