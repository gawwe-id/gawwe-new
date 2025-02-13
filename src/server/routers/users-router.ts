import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { j, privateProcedure } from "../jstack";
import { userUpdateSchema } from "../db/schema/users";

export const usersRouter = j.router({
  /** ========================================
 * GET USER BY ID
 ======================================== */
  single: privateProcedure
    .query(async ({ c, ctx }) => {
      const { db, user } = ctx;

      const [data] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id as string))
        .limit(1);

      return c.json(
        {
          message: "Success",
          data,
        },
        200
      );
    }),

  /** ========================================
 * GET USER LIST
 ======================================== */
  list: privateProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;
    const users = await db.query.users.findMany();

    return c.json(
      {
        message: "Success",
        data: users,
      },
      200
    );
  }),

  /** ========================================
 * UPDATE USER
 ======================================== */
  update: privateProcedure
    .input(
      z.object({ userId: z.string().uuid(), updateUser: userUpdateSchema })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { userId, updateUser } = input;

      const user = await db
        .update(users)
        .set(updateUser)
        .where(eq(users.id, userId))
        .returning();

      return c.json(
        {
          message: "Berhasil Update User",
          data: user[0],
        },
        200
      );
    }),
});
