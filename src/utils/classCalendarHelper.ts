import { Calendar } from "@/server/db/schema/calendars";
import { CalendarEventType } from "@/store/calendarStore";
import dayjs from "dayjs";

export type ClassCalendar = {
  id?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  languageClassId?: string | undefined;
  batch?: number | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  schedules?:
    | {
        id: string;
        classId: string;
        day: string;
        startTime: string;
        endTime: string;
      }[]
    | undefined;
};

export function getHighlightDates(classData: ClassCalendar): Date[] {
  const startDate = classData?.startDate as Date;
  const endDate = classData?.endDate as Date;

  const highlightDates: Date[] = [];

  const dayMap: Record<string, number> = {
    MINGGU: 0,
    SENIN: 1,
    SELASA: 2,
    RABU: 3,
    KAMIS: 4,
    JUMAT: 5,
    SABTU: 6,
  };

  const daysToHighlight = classData?.schedules
    ?.map((schedule) => dayMap[schedule?.day])
    ?.filter((day) => day !== undefined);

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    if (daysToHighlight?.includes(currentDate?.getDay())) {
      highlightDates?.push(new Date(currentDate));
    }

    currentDate?.setDate(currentDate.getDate() + 1);
  }

  return highlightDates;
}

/**
 * Transforms class data into calendar events
 * @param classes - Array of class objects with schedules
 * @returns Array of calendar events
 */
export function transformClassesToCalendarEvents(
  classes: ClassCalendar[]
): Array<{
  date: dayjs.Dayjs;
  title: string;
  description: string;
  type: string;
  eventType?: string;
  isOnline?: boolean;
  link?: string;
}> {
  // Map Indonesian day names to JavaScript day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayMapping: Record<string, number> = {
    SENIN: 1, // Monday
    SELASA: 2, // Tuesday
    RABU: 3, // Wednesday
    KAMIS: 4, // Thursday
    JUMAT: 5, // Friday
    SABTU: 6, // Saturday
    MINGGU: 0, // Sunday
  };

  const events: Array<{
    date: dayjs.Dayjs;
    title: string;
    description: string;
    type: string;
    eventType?: string;
    isOnline?: boolean;
    link?: string;
  }> = [];

  // Process each class
  classes.forEach((classItem) => {
    const startDate = dayjs(classItem.startDate);
    const endDate = dayjs(classItem.endDate);

    // Process each schedule for this class
    classItem.schedules?.forEach((schedule: any) => {
      const dayOfWeek = dayMapping[schedule.day];

      if (dayOfWeek === undefined) {
        console.warn(`Unknown day: ${schedule.day}`);
        return; // Skip this schedule
      }

      // Find the first occurrence of this day within or after the start date
      let firstOccurrence = dayjs(startDate);
      while (firstOccurrence.day() !== dayOfWeek) {
        firstOccurrence = firstOccurrence.add(1, "day");
      }

      // Generate all occurrences within the date range
      let currentDate = dayjs(firstOccurrence);
      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
        events.push({
          date: dayjs(currentDate), // Create a new dayjs object to avoid reference issues
          title: classItem?.name ?? "",
          description: classItem?.description ?? "",
          type: "schedule",
        });

        // Move to the next occurrence (7 days later)
        currentDate = currentDate.add(7, "day");
      }
    });
  });

  // Sort events by date
  events.sort((a, b) => a.date.unix() - b.date.unix());

  return events;
}

/**
 * Creates a combined calendar view including both class schedules and events
 * @param classes - Array of class objects with schedules
 * @param events - Array of event objects (optional)
 * @returns Combined and sorted array of calendar items
 */
export function createCombinedCalendar(
  classes: ClassCalendar[],
  events: Calendar[] = []
): CalendarEventType[] {
  // Get schedule events from classes
  const scheduleEvents = transformClassesToCalendarEvents(classes);

  // Transform events data if needed
  const formattedEvents = events.map((event) => ({
    date: dayjs(event.date),
    title: event.title,
    description: event.description,
    type: "event",
    eventType: event.eventType,
    isOnline: event?.isOnline,
    link: event.link ?? undefined,
  }));

  // Combine both arrays
  const combinedEvents = [...scheduleEvents, ...formattedEvents];

  // Sort by date
  combinedEvents.sort((a, b) => a.date.unix() - b.date.unix());

  return combinedEvents;
}
