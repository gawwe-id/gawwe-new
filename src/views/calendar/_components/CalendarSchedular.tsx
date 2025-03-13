import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {
  Box,
  Grid,
  Typography,
  Sheet,
  Button,
  IconButton,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider,
  FormControl,
  Select,
  Option,
  ButtonGroup,
} from "@mui/joy";
import {
  ChevronLeft,
  ChevronRight,
  CalendarViewMonth,
  DateRange,
  Today,
  ArrowDropDown,
} from "@mui/icons-material";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Add the week plugin to dayjs
dayjs.extend(weekOfYear);

// Define the calendar views
const VIEWS = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
};

// Color mapping based on event type
const getEventColor = (type: any) => {
  switch (type.toLowerCase()) {
    case "schedule":
      return "secondary";
    case "event":
      return "success";
    default:
      return "secondary";
  }
};

const CalendarScheduler = () => {
  const isMobile = useMediaQuery("(max-width: 576px)");

  // Sample events for demo
  const [events, setEvents] = useState([
    {
      date: dayjs().subtract(1, "day"),
      title: "Team Meeting",
      description: "Weekly team sync",
      type: "schedule",
      isOnline: true,
      link: "https://meet.example.com",
    },
    {
      date: dayjs().add(1, "day"),
      title: "English Assignment",
      description: "Complete essay",
      type: "event",
    },
    {
      date: dayjs(),
      title: "Math Class",
      description: "Algebra lesson",
      type: "schedule",
      eventType: "schedule",
    },
    {
      date: dayjs().add(2, "day"),
      title: "Science Exam",
      description: "Biology final",
      type: "event",
      isOnline: false,
    },
    {
      date: dayjs().add(5, "day"),
      title: "Project Deadline",
      description: "Submit final report",
      type: "schedule",
    },
    {
      date: dayjs().add(7, "day"),
      title: "History Workshop",
      description: "Ancient civilizations",
      type: "event",
    },
  ]);

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState(VIEWS.MONTH);

  // Generate calendar days for the month view
  const generateMonthDays = () => {
    const firstDayOfMonth = currentDate.startOf("month");
    const firstDayOfCalendar = firstDayOfMonth.startOf("week");

    const days = [];
    const daysToShow = 42; // 6 weeks (6 x 7)

    for (let i = 0; i < daysToShow; i++) {
      const day = dayjs(firstDayOfCalendar).add(i, "day");
      days.push(day);
    }

    return days;
  };

  // Generate days for the week view
  const generateWeekDays = () => {
    const startOfWeek = currentDate.startOf("week");
    const days = [];

    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, "day"));
    }

    return days;
  };

  // Generate hours for the day view
  const generateDayHours = () => {
    const hours = [];

    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }

    return hours;
  };

  // Get events for a specific day
  const getEventsForDay = (day: Dayjs) => {
    return events.filter(
      (event) => event.date.format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
    );
  };

  // Get events for a specific hour
  const getEventsForHour = (day: Dayjs, hour: number) => {
    return events.filter(
      (event) =>
        event.date.format("YYYY-MM-DD") === day.format("YYYY-MM-DD") &&
        event.date.hour() === hour
    );
  };

  // Handle navigation based on current view
  const goToPrevious = () => {
    if (view === VIEWS.MONTH) {
      setCurrentDate(currentDate.subtract(1, "month"));
    } else if (view === VIEWS.WEEK) {
      setCurrentDate(currentDate.subtract(1, "week"));
    } else {
      setCurrentDate(currentDate.subtract(1, "day"));
    }
  };

  const goToNext = () => {
    if (view === VIEWS.MONTH) {
      setCurrentDate(currentDate.add(1, "month"));
    } else if (view === VIEWS.WEEK) {
      setCurrentDate(currentDate.add(1, "week"));
    } else {
      setCurrentDate(currentDate.add(1, "day"));
    }
  };

  // Handle day click
  const handleDayClick = (day: Dayjs) => {
    const dayEvents = getEventsForDay(day);
    console.log(`Events for ${day.format("YYYY-MM-DD")}:`, dayEvents);
  };

  // Handle hour click in day view
  const handleHourClick = (hour: number) => {
    const hourEvents = getEventsForHour(currentDate, hour);
    console.log(
      `Events for ${currentDate.format("YYYY-MM-DD")} at ${hour}:00:`,
      hourEvents
    );
  };

  // Month view component
  const MonthView = () => {
    const days = generateMonthDays();
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <Box sx={{ width: "100%" }}>
        {/* Weekday headers */}
        <Grid container columns={7} spacing={0}>
          {weekDays.map((day, index) => (
            <Grid key={index} xs={1}>
              <Typography
                level="body-sm"
                textAlign="center"
                fontWeight="lg"
                sx={{ py: 1 }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar grid */}
        <Grid container columns={7} spacing={0}>
          {days.map((day, index) => {
            const isCurrentMonth = day.month() === currentDate.month();
            const isToday =
              day.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
            const dayEvents = getEventsForDay(day);

            return (
              <Grid key={index} xs={1}>
                <Sheet
                  onClick={() => handleDayClick(day)}
                  sx={{
                    height: isMobile ? "80px" : "120px",
                    p: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: isToday
                      ? "primary.100"
                      : isCurrentMonth
                      ? "background.surface"
                      : "background.level1",
                    opacity: isCurrentMonth ? 1 : 0.6,
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "background.level2",
                    },
                  }}
                >
                  <Typography
                    level="body-sm"
                    fontWeight={isToday ? "lg" : "md"}
                    color={isToday ? "primary" : "neutral"}
                  >
                    {day.date()}
                  </Typography>

                  {/* Events */}
                  <Stack
                    spacing={0.5}
                    mt={0.5}
                    sx={{
                      maxHeight: isMobile ? "45px" : "85px",
                      overflowY: "auto",
                    }}
                  >
                    {dayEvents.map((event, eventIndex) => (
                      <Chip
                        key={eventIndex}
                        size="sm"
                        variant="soft"
                        color={getEventColor(event.type)}
                        sx={{ height: "auto", py: 0.2, maxWidth: "100%" }}
                      >
                        <Typography level="body-xs" noWrap>
                          {event.title}
                        </Typography>
                      </Chip>
                    ))}
                  </Stack>
                </Sheet>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  // Week view component
  const WeekView = () => {
    const weekDays = generateWeekDays();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Grid container columns={8} spacing={0}>
          {/* Time column */}
          <Grid xs={1}>
            <Sheet
              sx={{
                height: "50px",
                p: 1,
                borderRight: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography level="body-xs" textAlign="center">
                Hour
              </Typography>
            </Sheet>
            {hours.map((hour) => (
              <Sheet
                key={hour}
                sx={{
                  height: "60px",
                  p: 1,
                  borderRight: "1px solid",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography level="body-xs" textAlign="end">
                  {hour}:00
                </Typography>
              </Sheet>
            ))}
          </Grid>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => {
            const isToday =
              day.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

            return (
              <Grid key={dayIndex} xs={1}>
                <Sheet
                  sx={{
                    height: "50px",
                    p: 1,
                    borderRight: "1px solid",
                    borderColor: "divider",
                    backgroundColor: isToday
                      ? "primary.100"
                      : "background.surface",
                  }}
                >
                  <Typography
                    level="body-sm"
                    textAlign="center"
                    fontWeight={isToday ? "lg" : "md"}
                    color={isToday ? "primary" : "neutral"}
                  >
                    {day.format("ddd DD")}
                  </Typography>
                </Sheet>

                {hours.map((hour) => {
                  const hourEvents = events.filter(
                    (event) =>
                      event.date.format("YYYY-MM-DD") ===
                        day.format("YYYY-MM-DD") && event.date.hour() === hour
                  );

                  return (
                    <Sheet
                      key={`${dayIndex}-${hour}`}
                      onClick={() => {
                        console.log(
                          `Events for ${day.format(
                            "YYYY-MM-DD"
                          )} at ${hour}:00:`,
                          hourEvents
                        );
                      }}
                      sx={{
                        height: "60px",
                        p: 0.5,
                        borderRight: "1px solid",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        backgroundColor: isToday
                          ? "primary.50"
                          : "background.surface",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "background.level2",
                        },
                        overflow: "hidden",
                      }}
                    >
                      <Stack
                        spacing={0.5}
                        sx={{ height: "100%", overflowY: "auto" }}
                      >
                        {hourEvents.map((event, index) => (
                          <Chip
                            key={index}
                            size="sm"
                            variant="soft"
                            color={getEventColor(event.type)}
                            sx={{ height: "auto", py: 0.2, maxWidth: "100%" }}
                          >
                            <Typography level="body-xs" noWrap>
                              {event.title}
                            </Typography>
                          </Chip>
                        ))}
                      </Stack>
                    </Sheet>
                  );
                })}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  // Day view component
  const DayView = () => {
    const hours = generateDayHours();
    const isToday =
      currentDate.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

    return (
      <Box sx={{ width: "100%" }}>
        <Sheet
          sx={{
            p: 1,
            mb: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: isToday ? "primary.100" : "background.surface",
          }}
        >
          <Typography
            level="h4"
            textAlign="center"
            fontWeight={isToday ? "lg" : "md"}
            color={isToday ? "primary" : "neutral"}
          >
            {currentDate.format("dddd, MMMM D, YYYY")}
          </Typography>
        </Sheet>

        <Box sx={{ maxHeight: "600px", overflowY: "auto" }}>
          {hours.map((hour) => {
            const hourEvents = getEventsForHour(currentDate, hour);

            return (
              <Sheet
                key={hour}
                onClick={() => handleHourClick(hour)}
                sx={{
                  display: "flex",
                  p: 1,
                  mb: 0.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  minHeight: "60px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "background.level2",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "60px",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    pr: 1,
                  }}
                >
                  <Typography level="body-md" textAlign="end">
                    {hour}:00
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, ml: 2 }}>
                  <Stack spacing={1}>
                    {hourEvents.map((event, index) => (
                      <Card
                        key={index}
                        variant="soft"
                        color={getEventColor(event.type)}
                        sx={{ p: 1 }}
                      >
                        <Typography level="body-sm" fontWeight="lg">
                          {event.title}
                        </Typography>
                        <Typography level="body-xs">
                          {event.description}
                        </Typography>
                        {event.isOnline !== undefined && (
                          <Typography level="body-xs">
                            {event.isOnline ? "Online" : "In-person"}
                          </Typography>
                        )}
                      </Card>
                    ))}
                  </Stack>
                </Box>
              </Sheet>
            );
          })}
        </Box>
      </Box>
    );
  };

  // Get the appropriate title based on current view
  const getViewTitle = () => {
    if (view === VIEWS.MONTH) {
      return currentDate.format("MMMM YYYY");
    } else if (view === VIEWS.WEEK) {
      const startOfWeek = currentDate.startOf("week");
      const endOfWeek = currentDate.endOf("week");
      return `${startOfWeek.format("MMM D")} - ${endOfWeek.format(
        "MMM D, YYYY"
      )}`;
    } else {
      return currentDate.format("dddd, MMMM D");
    }
  };

  // View selector for mobile
  const ViewSelector = () => (
    <FormControl size="sm">
      <Select
        value={view}
        onChange={(_, newValue) => setView(newValue as string)}
        startDecorator={
          view === VIEWS.MONTH ? (
            <CalendarViewMonth />
          ) : view === VIEWS.WEEK ? (
            <DateRange />
          ) : (
            <Today />
          )
        }
        endDecorator={<ArrowDropDown />}
        sx={{ minWidth: "120px" }}
      >
        <Option value={VIEWS.MONTH}>Month</Option>
        <Option value={VIEWS.WEEK}>Week</Option>
        <Option value={VIEWS.DAY}>Day</Option>
      </Select>
    </FormControl>
  );

  // Regular view toggle buttons for desktop
  const ViewToggleButtons = () => (
    <ButtonGroup size="sm" variant="outlined" color="primary">
      <Button
        onClick={() => setView(VIEWS.MONTH)}
        variant={view === VIEWS.MONTH ? "soft" : "outlined"}
      >
        Month
      </Button>
      <Button
        onClick={() => setView(VIEWS.WEEK)}
        variant={view === VIEWS.WEEK ? "soft" : "outlined"}
      >
        Week
      </Button>
      <Button
        onClick={() => setView(VIEWS.DAY)}
        variant={view === VIEWS.DAY ? "soft" : "outlined"}
      >
        Day
      </Button>
    </ButtonGroup>
  );

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent>
        {/* Calendar header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            mb: 2,
            gap: isMobile ? 2 : 0,
          }}
        >
          <Typography level={isMobile ? "h4" : "h3"}>
            {getViewTitle()}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: isMobile ? "100%" : "auto",
              justifyContent: isMobile ? "space-between" : "flex-end",
              alignItems: "center",
            }}
          >
            {/* View toggle - dropdown on mobile, buttons on desktop */}
            {isMobile ? <ViewSelector /> : <ViewToggleButtons />}

            {!isMobile && <Divider orientation="vertical" sx={{ mx: 1 }} />}

            {/* Navigation buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton variant="soft" onClick={goToPrevious}>
                <ChevronLeft />
              </IconButton>
              <Button
                variant="plain"
                onClick={() => setCurrentDate(dayjs())}
                size="sm"
              >
                Today
              </Button>
              <IconButton variant="soft" onClick={goToNext}>
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Calendar body */}
        {view === VIEWS.MONTH && <MonthView />}
        {view === VIEWS.WEEK && <WeekView />}
        {view === VIEWS.DAY && <DayView />}
      </CardContent>
    </Card>
  );
};

export default CalendarScheduler;
