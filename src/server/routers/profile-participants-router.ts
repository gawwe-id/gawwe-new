import { profileParticipants } from "@/server/db/schema";
import {
  insertProfileParticipantSchema,
  updateProfileParticipantSchema,
} from "@/server/db/schema/profileParticipants";
import { eq } from "drizzle-orm";
import { j, privateProcedure } from "../jstack";
import { z } from "zod";
import { errorHandler } from "@/utils/error-handler";
import { AppError } from "@/types/error";

export const profileParticipantsRouter = j.router({
  /** ========================================
 * CREATE PROFILE PARTICIPANT
 ======================================== */
  create: privateProcedure
    .input(insertProfileParticipantSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      // Check if profile already exists
      const existingProfile = await db
        .select()
        .from(profileParticipants)
        .where(eq(profileParticipants.userId, user.id as string))
        .limit(1);

      if (existingProfile.length > 0) {
        throw new AppError(
          409,
          "Profile already exists for this user",
          "PROFILE_EXISTS"
        );
      }

      const [participant] = await db
        .insert(profileParticipants)
        .values(input)
        .returning();

      if (!participant) {
        throw new AppError(
          500,
          "Gagal membuat profile",
          "PROFILE_CREATION_FAILED"
        );
      }

      return c.json(
        {
          message: "Berhasil membuat Profile",
          data: participant,
        },
        200
      );
    }),

  /** ========================================
 * GET SINGLE PROFILE PARTICIPANT
 ======================================== */
  single: privateProcedure.query(async ({ c, ctx }) => {
    const { db, user } = ctx;
    const userId = user.id as string | undefined;

    if (!userId) {
      throw new AppError(404, "Profile tidak ditemukan", "PROFILE_NOT_FOUND");
    }

    const [participant] = await db
      .select()
      .from(profileParticipants)
      .where(eq(profileParticipants.userId, userId))
      .execute();

    return c.json(
      {
        status: "success",
        message: "Berhasil menampilkan profile",
        data: participant,
      },
      200
    );
  }),

  /** ========================================
 * UPDATE PROFILE PARTICIPANT
 ======================================== */
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        updateProfile: updateProfileParticipantSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { id, updateProfile } = input;

      const [participant] = await db
        .update(profileParticipants)
        .set(updateProfile)
        .where(eq(profileParticipants.id, id))
        .returning();

      return c.json(
        {
          message: "Berhasil update Profile",
          data: participant,
        },
        200
      );
    }),
});
