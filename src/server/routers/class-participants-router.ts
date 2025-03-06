import { classes, languageClassEnrollments, users } from "@/server/db/schema";
import { j, privateProcedure } from "../jstack";
import { z } from "zod";
import { count, eq } from "drizzle-orm";
import { throwApiError } from "@/utils/api-error";

export const classParticipantsRouter = j.router({
  /** ========================================
   * GET PARTICIPANTS BY CLASS ID
   ======================================== */
  listByClassId: privateProcedure
    .input(
      z.object({
        classId: z.string(),
        limit: z.number().optional().default(5),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { classId, limit } = input;

      // First, get the class to find its languageClassId
      const [cls] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, classId))
        .execute();

      if (!cls) {
        throwApiError(404, "Kelas tidak ditemukan", "CLASS_NOT_FOUND");
      }

      // Get the language class ID
      const languageClassId = cls?.languageClassId;

      // Find enrollments for the language class
      const enrollments = await db
        .select({
          enrollment: languageClassEnrollments,
          user: users,
        })
        .from(languageClassEnrollments)
        .innerJoin(users, eq(languageClassEnrollments.userId, users.id))
        .where(eq(languageClassEnrollments.classId, languageClassId as string))
        .limit(limit)
        .execute();

      // Format the result
      const participants = enrollments.map((enrollment) => ({
        id: enrollment.enrollment.id,
        userId: enrollment.user.id,
        name: enrollment.user.name,
        email: enrollment.user.email,
        image: enrollment.user.image,
        enrolledAt: enrollment.enrollment.enrolledAt,
      }));

      // Get total count of enrollments for pagination
      const [result] = await db
        .select({ totalCount: count() })
        .from(languageClassEnrollments)
        .where(eq(languageClassEnrollments.classId, languageClassId as string))
        .execute();

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar peserta",
          data: participants,
          meta: {
            total: Number(result?.totalCount),
          },
        },
        200
      );
    }),
});
