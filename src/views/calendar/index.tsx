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
    // const mappedEvents: CalendarEventType[] = classSchedules?.data.map((event) => ({
    //   id: event.id,
    //   date: dayjs(event.date),
    //   title: event.title,
    //   description: event.description,
    // }));
    // setEvents(mappedEvents);
  }, [classes, setEvents]);

  console.log("CLASSS sc : ", classes);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography level="h2" sx={{ mb: 3 }}>
        {t("schedule.title")}
      </Typography>
    </Box>
  );
}
