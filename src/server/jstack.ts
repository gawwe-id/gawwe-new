import { InferMiddlewareOutput, jstack } from "jstack";
import { db } from "./db";
import { HTTPException } from "hono/http-exception";
import { auth } from "@/lib/auth";

interface Env {
  Bindings: { DATABASE_URL: string };
}

export const j = jstack.init<Env>();

type Role = "admin" | "agency" | "participant";

/**
 * Type-safely injects database into all procedures
 *
 * @see https://jstack.app/docs/backend/middleware
 */
const databaseMiddleware = j.middleware(async ({ c, next }) => {
  return await next({ db });
});

const authMiddleware = j.middleware(async ({ c, next }) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new HTTPException(401, {
      message: "Unauthorized, sign in to continue.",
    });
  }

  return await next({
    user: { ...session.user, role: session.user.role as Role },
  });
});

type AuthMiddlewareOutput = InferMiddlewareOutput<typeof authMiddleware>;

export const roleMiddleware = (allowedRoles: Role[]) =>
  j.middleware(async ({ c, ctx, next }) => {
    const { user } = ctx as AuthMiddlewareOutput;

    if (!allowedRoles.includes(user?.role)) {
      return c.json({ message: "Forbidden: Akses ditolak", data: null }, 401);
    }

    return await next();
  });

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const publicProcedure = j.procedure.use(databaseMiddleware);
export const privateProcedure = publicProcedure.use(authMiddleware);
