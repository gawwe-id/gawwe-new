import { users, profileAgencies } from "@/server/db/schema";
import {
  insertProfileAgencySchema,
  updateProfileAgencySchema,
} from "@/server/db/schema/profileAgencies";
import { eq } from "drizzle-orm";
import { j, privateProcedure } from "../jstack";
import { z } from "zod";

export const profileAgenciesRouter = j.router({
  /** ========================================
 * CREATE PROFILE AGENCY
 ======================================== */
  create: privateProcedure
    .input(insertProfileAgencySchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;

      const [agency] = await db
        .insert(profileAgencies)
        .values(input)
        .returning();

      await db
        .update(users)
        .set({ profileCompletion: 1 })
        .where(eq(users.id, agency?.userId ?? ""));

      return c.json(
        {
          message: "Berhasil membuat Profile",
          data: agency,
        },
        200
      );
    }),

  /** ========================================
 * GET SINGLE PROFILE AGENCY
 ======================================== */
  single: privateProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { profileId } = input;

      const [agency] = await db
        .select()
        .from(profileAgencies)
        .where(eq(profileAgencies.id, profileId))
        .execute();

      return c.json(
        {
          message: "Success",
          data: agency,
        },
        200
      );
    }),

  /** ========================================
 * UPDATE PROFILE AGENCY
 ======================================== */
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        updateProfile: updateProfileAgencySchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { id, updateProfile } = input;

      const [agency] = await db
        .update(profileAgencies)
        .set(updateProfile)
        .where(eq(profileAgencies.id, id))
        .returning();

      return c.json(
        {
          message: "Berhasil update Profile",
          data: agency,
        },
        200
      );
    }),
});
