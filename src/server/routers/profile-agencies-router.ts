import { profileAgencies } from "@/server/db/schema";
import {
  insertProfileAgencySchema,
  updateProfileAgencySchema,
} from "@/server/db/schema/profileAgencies";
import { eq } from "drizzle-orm";
import { j, privateProcedure } from "../jstack";
import { z } from "zod";
import { AppError } from "@/types/error";

export const profileAgenciesRouter = j.router({
  /** ========================================
 * CREATE PROFILE AGENCY
 ======================================== */
  create: privateProcedure
    .input(insertProfileAgencySchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      // Check if profile already exists
      const existingProfile = await db
        .select()
        .from(profileAgencies)
        .where(eq(profileAgencies.userId, user.id as string))
        .limit(1);

      if (existingProfile.length > 0) {
        throw new AppError(
          409,
          "Profile already exists for this user",
          "PROFILE_EXISTS"
        );
      }

      const [agency] = await db
        .insert(profileAgencies)
        .values(input)
        .returning();

      if (!agency) {
        throw new AppError(
          500,
          "Gagal membuat profile",
          "PROFILE_CREATION_FAILED"
        );
      }

      return c.superjson(
        {
          status: "success",
          message: "Berhasil membuat Profile",
          data: agency,
        },
        201
      );
    }),

  /** ========================================
 * GET SINGLE PROFILE AGENCY
 ======================================== */
  single: privateProcedure.query(async ({ c, ctx }) => {
    const { db, user } = ctx;

    const [agency] = await db
      .select()
      .from(profileAgencies)
      .where(eq(profileAgencies.userId, user.id as string))
      .execute();

    if (!agency) {
      throw new AppError(404, "Profile not found", "PROFILE_NOT_FOUND");
    }

    return c.superjson(
      {
        status: "success",
        message: "Berhasil menampilkan Profile",
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
      const { db, user } = ctx;
      const { id, updateProfile } = input;

      const [existingProfile] = await db
        .select()
        .from(profileAgencies)
        .where(eq(profileAgencies.id, id))
        .limit(1);

      if (!existingProfile) {
        throw new AppError(404, "Profile not found", "PROFILE_NOT_FOUND");
      }

      if (existingProfile?.userId !== user?.id) {
        throw new AppError(
          403,
          "Not authorized to update this profile",
          "UNAUTHORIZED"
        );
      }

      const [agency] = await db
        .update(profileAgencies)
        .set(updateProfile)
        .where(eq(profileAgencies.id, id))
        .returning();

      if (!agency) {
        throw new AppError(
          500,
          "Failed to update profile",
          "PROFILE_UPDATE_FAILED"
        );
      }

      return c.superjson(
        {
          status: "success",
          message: "Berhasil update Profile",
          data: agency,
        },
        200
      );
    }),
});
