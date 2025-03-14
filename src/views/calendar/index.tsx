// schedule/page.jsx
"use client";

import React, { useEffect } from "react";
import { Box, Card, Grid, Skeleton } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useEventStore } from "@/store/calendarStore";
import { useClassesByUserId } from "@/hooks/useClass";
import { createCombinedCalendar } from "@/utils/classCalendarHelper";
import CalendarScheduler from "./_components/CalendarSchedular";
import EventDetails from "./_components/EventDetails";

export default function SchedulePage() {
  const { setEvents } = useEventStore();

  const { data: classes, isLoading } = useClassesByUserId();

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
      <Grid container spacing={3}>
        <Grid xs={12} md={9}>
          {isLoading ? (
            <Card sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={500} />
            </Card>
          ) : (
            <CalendarScheduler />
          )}
        </Grid>
        <Grid xs={12} md={3}>
          {isLoading ? (
            <Card sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={450} />
            </Card>
          ) : (
            <EventDetails />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
