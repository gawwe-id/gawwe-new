import { users, profileParticipants } from '@/server/db/schema';
import {
  insertProfileParticipantSchema,
  updateProfileParticipantSchema
} from '@/server/db/schema/profileParticipants';
import { eq } from 'drizzle-orm';
import { j, privateProcedure } from '../jstack';
import { z } from 'zod';

export const profileParticipantsRouter = j.router({
  /** ========================================
 * CREATE PROFILE PARTICIPANT
 ======================================== */
  create: privateProcedure
    .input(insertProfileParticipantSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;

      const [participant] = await db
        .insert(profileParticipants)
        .values(input)
        .returning();

      return c.json(
        {
          message: 'Berhasil membuat Profile',
          data: participant
        },
        200
      );
    }),

  /** ========================================
 * GET SINGLE PROFILE PARTICIPANT
 ======================================== */
  single: privateProcedure.query(async ({ c, ctx }) => {
    const { db, user } = ctx;
    const userId = user.id;

    if (!userId) {
      return c.json(
        {
          message: 'User Not Fount',
          data: null
        },
        404
      );
    }

    const [participant] = await db
      .select()
      .from(profileParticipants)
      .where(eq(profileParticipants.userId, userId))
      .execute();

    return c.json(
      {
        message: 'Success',
        data: participant
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
        updateProfile: updateProfileParticipantSchema
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
          message: 'Berhasil update Profile',
          data: participant
        },
        200
      );
    })
});
