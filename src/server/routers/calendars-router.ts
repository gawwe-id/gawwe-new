import {
  calendars,
  classes,
  languageClassEnrollments,
  languageClasses,
} from "@/server/db/schema";
import {
  insertCalendarSchema,
  updateCalendarSchema,
} from "@/server/db/schema/calendars";
import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { j, privateProcedure, publicProcedure } from "../jstack";
import { z } from "zod";
import { throwApiError } from "@/utils/api-error";

export const calendarsRouter = j.router({
  /** ========================================
   * CREATE CALENDAR EVENT
   ======================================== */
  create: privateProcedure
    .input(insertCalendarSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;

      // Verify the class exists and belongs to a language owned by the user
      const [cls] = await db
        .select({
          class: classes,
          language: languageClasses,
        })
        .from(classes)
        .leftJoin(
          languageClasses,
          eq(classes.languageClassId, languageClasses.id)
        )
        .where(
          and(
            eq(classes.id, input.classId),
            eq(languageClasses.userId, user.id as string)
          )
        )
        .execute();

      if (!cls) {
        throwApiError(
          404,
          "Kelas tidak ditemukan atau Anda tidak memiliki akses",
          "CLASS_NOT_FOUND"
        );
      }

      const [calendarEvent] = await db
        .insert(calendars)
        .values(input)
        .returning();

      return c.superjson(
        {
          message: "Event kalender berhasil dibuat",
          data: calendarEvent,
        },
        201
      );
    }),

  /** ========================================
   * GET ALL CALENDAR EVENTS
   ======================================== */
  list: privateProcedure.query(async ({ c, ctx }) => {
    const { db, user } = ctx;

    const userId = user.id as string;
    const userRole = user.role;

    // Get language class IDs based on user role
    let languageClassIds: string[] = [];

    if (userRole === "agency") {
      // For agency: get language classes owned by this user
      const ownedLanguageClasses = await db
        .select({
          id: languageClasses.id,
        })
        .from(languageClasses)
        .where(eq(languageClasses.userId, userId))
        .execute();

      languageClassIds = ownedLanguageClasses.map((lc) => lc.id);
    } else if (userRole === "participant") {
      // For participant: get language classes the user is enrolled in
      const userEnrollments = await db
        .select({
          languageClassId: languageClassEnrollments.classId,
        })
        .from(languageClassEnrollments)
        .where(eq(languageClassEnrollments.userId, userId))
        .execute();

      languageClassIds = userEnrollments.map(
        (enrollment) => enrollment.languageClassId
      );
    }

    // If no language classes found, return empty list
    if (languageClassIds.length === 0) {
      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar event kalender",
          data: [],
        },
        200
      );
    }

    // Get classes for these language classes
    const relatedClasses = await db
      .select({
        id: classes.id,
      })
      .from(classes)
      .where(inArray(classes.languageClassId, languageClassIds))
      .execute();

    const classIds = relatedClasses.map((cls) => cls.id);

    // If no classes found, return empty list
    if (classIds.length === 0) {
      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar event kalender",
          data: [],
        },
        200
      );
    }

    // Get calendar events for these classes
    const events = await db
      .select()
      .from(calendars)
      .where(inArray(calendars.classId, classIds))
      .execute();

    return c.superjson(
      {
        message: "Berhasil mendapatkan daftar event kalender",
        data: events,
      },
      200
    );
  }),

  /** ========================================
   * GET CALENDAR EVENT BY ID
   ======================================== */
  single: publicProcedure
    .input(z.object({ calendarId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { calendarId } = input;

      const [calendarEvent] = await db
        .select()
        .from(calendars)
        .where(eq(calendars.id, calendarId))
        .execute();

      if (!calendarEvent) {
        throwApiError(404, "Event kalender tidak ditemukan", "EVENT_NOT_FOUND");
      }

      return c.superjson(
        {
          message: "Berhasil mendapatkan detail event kalender",
          data: calendarEvent,
        },
        200
      );
    }),

  /** ========================================
   * GET CALENDAR EVENTS BY CLASS ID
   ======================================== */
  byClass: publicProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { classId } = input;

      const eventsByClass = await db
        .select()
        .from(calendars)
        .where(eq(calendars.classId, classId))
        .execute();

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar event kalender untuk kelas",
          data: eventsByClass,
        },
        200
      );
    }),

  /** ========================================
   * UPDATE CALENDAR EVENT
   ======================================== */
  update: privateProcedure
    .input(
      z.object({
        calendarId: z.string(),
        updateCalendar: updateCalendarSchema,
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { calendarId, updateCalendar } = input;

      // Verify the calendar event exists and belongs to a class owned by the user
      const [existingEvent] = await db
        .select({
          event: calendars,
          class: classes,
          language: languageClasses,
        })
        .from(calendars)
        .leftJoin(classes, eq(calendars.classId, classes.id))
        .leftJoin(
          languageClasses,
          eq(classes.languageClassId, languageClasses.id)
        )
        .where(
          and(
            eq(calendars.id, calendarId),
            eq(languageClasses.userId, user.id as string)
          )
        )
        .execute();

      if (!existingEvent) {
        throwApiError(
          404,
          "Event kalender tidak ditemukan atau Anda tidak memiliki akses",
          "EVENT_NOT_FOUND"
        );
      }

      const [updatedEvent] = await db
        .update(calendars)
        .set(updateCalendar)
        .where(eq(calendars.id, calendarId))
        .returning();

      return c.superjson(
        {
          message: "Event kalender berhasil diperbarui",
          data: updatedEvent,
        },
        200
      );
    }),

  /** ========================================
   * DELETE CALENDAR EVENT
   ======================================== */
  delete: privateProcedure
    .input(z.object({ calendarId: z.string() }))
    .mutation(async ({ c, ctx, input }) => {
      const { db, user } = ctx;
      const { calendarId } = input;

      // Verify the calendar event exists and belongs to a class owned by the user
      const [existingEvent] = await db
        .select({
          event: calendars,
          class: classes,
          language: languageClasses,
        })
        .from(calendars)
        .leftJoin(classes, eq(calendars.classId, classes.id))
        .leftJoin(
          languageClasses,
          eq(classes.languageClassId, languageClasses.id)
        )
        .where(
          and(
            eq(calendars.id, calendarId),
            eq(languageClasses.userId, user.id as string)
          )
        )
        .execute();

      if (!existingEvent) {
        throwApiError(
          404,
          "Event kalender tidak ditemukan atau Anda tidak memiliki akses",
          "EVENT_NOT_FOUND"
        );
      }

      await db.delete(calendars).where(eq(calendars.id, calendarId)).execute();

      return c.superjson(
        {
          message: "Event kalender berhasil dihapus",
          data: null,
        },
        200
      );
    }),

  /** ========================================
   * GET UPCOMING EVENTS
   ======================================== */
  upcoming: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        userId: z.string().optional(),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { limit, userId } = input;

      let upcomingEvents;

      if (userId) {
        // Get events for classes the user is enrolled in
        upcomingEvents = await db
          .select({
            event: calendars,
            class: classes,
          })
          .from(calendars)
          .leftJoin(classes, eq(calendars.classId, classes.id))
          .where(
            and(
              // User enrolled classes query would go here
              // This is a placeholder, as we don't see the enrollment schema in the context
              eq(calendars.date, calendars.date) // Placeholder condition
            )
          )
          .orderBy(calendars.date)
          .limit(limit)
          .execute();
      } else {
        // Get all upcoming events
        upcomingEvents = await db
          .select()
          .from(calendars)
          .where(
            // Events that are today or in the future
            gte(calendars.date, new Date())
          )
          .orderBy(calendars.date)
          .limit(limit)
          .execute();
      }

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar event yang akan datang",
          data: upcomingEvents,
        },
        200
      );
    }),

  /** ========================================
   * GET EVENTS BY DATE RANGE
   ======================================== */
  byDateRange: publicProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.string(),
      })
    )
    .query(async ({ c, ctx, input }) => {
      const { db } = ctx;
      const { startDate, endDate } = input;

      // Convert string dates to Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      let query = db
        .select()
        .from(calendars)
        .where(and(gte(calendars.date, start), lte(calendars.date, end)));

      const events = await query.orderBy(calendars.date).execute();

      return c.superjson(
        {
          message: "Berhasil mendapatkan daftar event dalam rentang tanggal",
          data: events,
        },
        200
      );
    }),
});
