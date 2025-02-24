import { roles } from "@/server/db/schema";
import { j, publicProcedure } from "../jstack";
import { insertRoleSchema } from "../db/schema/roles";

export const rolesRouter = j.router({
  /** ========================================
 * CREATE ROLE
 ======================================== */
  create: publicProcedure
    .input(insertRoleSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db } = ctx;

      const role = await db.insert(roles).values(input).returning();

      return c.superjson(
        {
          message: "Berhasil menambahkan Role",
          data: role,
        },
        200
      );
    }),

  /** ========================================
 * LIST ROLES
 ======================================== */
  list: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;
    const rolesList = await db.select().from(roles);

    return c.superjson(
      {
        message: "Success",
        data: rolesList,
      },
      200
    );
  }),
});
