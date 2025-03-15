import { assignments } from "@/server/db/schema";
import {
  insertAssignmentSchema,
  updateAssignmentSchema,
} from "@/server/db/schema/assignments";
import { eq } from "drizzle-orm";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { z } from "zod";
import { throwApiError } from "@/utils/api-error";
import { classes } from "@/server/db/schema";

export const assignmentsRouter = j.router({
  /** ========================================
   * CREATE ASSIGNMENT
   ======================================== */
  create: privateProcedure
    .input(insertAssignmentSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      // Verify the class exists and user has access to it
      const [cls] = await db
        .select()
        .from(classes)
        .where(eq(classes.id, input.classId as string))
        .execute();

      if (!cls) {
        throwApiError(404, "Kelas tidak ditemukan", "CLASS_NOT_FOUND");
      }

      const [assignment] = await db
        .insert(assignments)
        .values(input)
        .returning();

      return c.superjson(
        {
          message: "Berhasil membuat tugas",
          data: assignment,
        },
        201
      );
    }),

  /** ========================================
   * GET ALL ASSIGNMENTS
   ======================================== */
  list: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx;
    const allAssignments = await db.select().from(assignments).execute();

    return c.superjson(
      {
        message: "Berhasil mendapatkan daftar tugas",
        data: allAssignments,
      },
      200
    );
  }),

  /** ========================================
   * GET ASSIGNMENT BY ID
   ======================================== */
  single: publicProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { assignmentId } = input;

      const [assignment] = await db
        .select()
        .from(assignments)
        .where(eq(assignments.id, assignmentId))
        .execute();

      if (!assignment) {
        throwApiError(404, "Tugas tidak ditemukan", "ASSIGNMENT_NOT_FOUND");
      }

      return c.superjson(
        {
          message: "Berhasil mendapatkan detail tugas",
          data: assignment,
        },
        200
      );
    }),

  /** ========================================
   * GET ASSIGNMENTS BY CLASS ID
   ======================================== */
  byClass: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { classId } = input;

      const assignmentsByClass = await db
        .select()
        .from(assignments)
        .where(eq(assignments.classId, classId))
        .execute();

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar tugas berdasarkan kelas",
          data: assignmentsByClass,
        },
        200
      );
    }),

  /** ========================================
   * GET ASSIGNMENTS BY CALENDAR ID
   ======================================== */
  byCalendar: publicProcedure
    .input(z.object({ calendarId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { calendarId } = input;

      const assignmentsByCalendar = await db
        .select()
        .from(assignments)
        .where(eq(assignments.calendarId, calendarId))
        .execute();

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar tugas berdasarkan kalender",
          data: assignmentsByCalendar,
        },
        200
      );
    }),

  /** ========================================
   * UPDATE ASSIGNMENT
   ======================================== */
  update: privateProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        updateAssignment: updateAssignmentSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { assignmentId, updateAssignment } = input;

      // Verify the assignment exists
      const [assignment] = await db
        .select()
        .from(assignments)
        .where(eq(assignments.id, assignmentId))
        .execute();

      if (!assignment) {
        throwApiError(404, "Tugas tidak ditemukan", "ASSIGNMENT_NOT_FOUND");
      }

      // If classId is being updated, verify the new class exists
      if (updateAssignment.classId) {
        const [cls] = await db
          .select()
          .from(classes)
          .where(eq(classes.id, updateAssignment.classId))
          .execute();

        if (!cls) {
          throwApiError(404, "Kelas tidak ditemukan", "CLASS_NOT_FOUND");
        }
      }

      const [updatedAssignment] = await db
        .update(assignments)
        .set(updateAssignment)
        .where(eq(assignments.id, assignmentId))
        .returning();

      return c.superjson(
        {
          message: "Berhasil memperbarui tugas",
          data: updatedAssignment,
        },
        200
      );
    }),

  /** ========================================
   * DELETE ASSIGNMENT
   ======================================== */
  delete: privateProcedure
    .input(z.object({ assignmentId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { assignmentId } = input;

      // Verify the assignment exists
      const [assignment] = await db
        .select()
        .from(assignments)
        .where(eq(assignments.id, assignmentId))
        .execute();

      if (!assignment) {
        throwApiError(404, "Tugas tidak ditemukan", "ASSIGNMENT_NOT_FOUND");
      }

      await db
        .delete(assignments)
        .where(eq(assignments.id, assignmentId))
        .execute();

      return c.superjson(
        {
          message: "Berhasil menghapus tugas",
          data: null,
        },
        200
      );
    }),
});
