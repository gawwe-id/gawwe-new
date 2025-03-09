import { accounts, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { userUpdateSchema } from "../db/schema/users";
import { throwApiError } from "@/utils/api-error";

export const usersRouter = j.router({
  /** ========================================
 * CHECK EMAIL EXIST
 ======================================== */
  emailExist: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { email } = input;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .execute();

      return c.superjson(
        {
          message: user ? "Email exists" : "Email not found",
          data: !!user,
        },
        200
      );
    }),

  /** ========================================
   * CHECK EMAIL AUTH PROVIDER
   ======================================== */
  checkAuthProvider: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { email } = input;

      // First check if the user exists
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .execute();

      if (!user) {
        return c.superjson(
          {
            message: "Email not found",
            exists: false,
            providers: [],
          },
          200
        );
      }

      // Then check which provider(s) they've used
      const userAccounts = await db
        .select({
          provider: accounts.provider,
        })
        .from(accounts)
        .where(eq(accounts.userId, user.id))
        .execute();

      const providers = userAccounts.map((account) => account.provider);

      return c.superjson(
        {
          message: "User found",
          exists: true,
          providers,
        },
        200
      );
    }),

  /** ========================================
 * GET USER BY ID
 ======================================== */
  single: privateProcedure.query(async ({ c, ctx }) => {
    const { db, user } = ctx;

    const [data] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id as string))
      .limit(1);

    if (!data) {
      throwApiError(404, "User not found");
    }

    return c.superjson(
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

    return c.superjson(
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

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!existingUser.length) {
        throwApiError(404, "User not found", "USER_NOT_FOUND");
      }

      const user = await db
        .update(users)
        .set(updateUser)
        .where(eq(users.id, userId))
        .returning();

      return c.superjson(
        {
          message: "Berhasil Update User",
          data: user[0],
        },
        200
      );
    }),
});
