export type ClassCalendar = {
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  id?: string | undefined;
  languageClassId?: string | undefined;
  name?: string | undefined;
  batch?: number | undefined;
  description?: string | undefined;
  schedules:
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
