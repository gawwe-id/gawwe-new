// schedule/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Sheet,
  Typography,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Stack,
} from "@mui/joy";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import {
  CalendarEventType,
  useDateStore,
  useEventStore,
  useViewStore,
} from "@/store/calendarStore";
import dayjs from "dayjs";
import { useClassesByUserId } from "@/hooks/useClass";
import {
  createCombinedCalendar,
  transformClassesToCalendarEvents,
} from "@/utils/classCalendarHelper";
import CalendarScheduler from "./_components/CalendarSchedular";

export default function SchedulePage() {
  const { t } = useTranslation("common");

  const { selectedView } = useViewStore();

  const {
    isPopoverOpen,
    closePopover,
    isEventSummaryOpen,
    closeEventSummary,
    selectedEvent,
    setEvents,
  } = useEventStore();

  const { userSelectedDate } = useDateStore();

  const { data: classes, isLoading, error } = useClassesByUserId();

  const { data: calendars } = useQuery({
    queryKey: ["calendars"],
    queryFn: async () => {
      const res = await client.calendars.list.$get();
      return await res.json();
    },
  });

  useEffect(() => {
    const mappedEvents = createCombinedCalendar(
      classes?.data ?? [],
      calendars?.data
    );

    setEvents(mappedEvents);
  }, [classes, calendars, setEvents]);

  return (
    <Box>
      {/* <Stack>
        <MiniCalendar />
      </Stack> */}
      <CalendarScheduler />
    </Box>
  );
}

// Array<{
//   date: dayjs.Dayjs;
//   title: string;
//   description: string;
//   type: string;
//   eventType?: string;
//   isOnline?: boolean;
//   link?: string;
// }>

// based on this data, can you make a full callendar scheduler? in each date there is data schedule or event showing (with different color based on type). when click the date, print the data in the console()  for now please create a Month View first! next, create a Week View and Day View
