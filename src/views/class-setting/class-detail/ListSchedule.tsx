import { ClassSchedule } from "@/server/db/schema/classSchedules";
import { AccessTimeRounded, CalendarMonthRounded } from "@mui/icons-material";
import {
  Chip,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import React from "react";

interface ListScheduleProps {
  schedules: ClassSchedule[] | undefined;
  onEdit: (schedule: ClassSchedule) => void;
  onDelete: (scheduleId: string) => void;
  isLoading: boolean;
}

const ListSchedule = ({
  schedules,
  onEdit,
  onDelete,
  isLoading,
}: ListScheduleProps) => {
  const formatTime = (timeString: string) => {
    try {
      if (!timeString) return "";

      if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
        return timeString.substring(0, 5);
      }

      const date = new Date(`1970-01-01T${timeString}`);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  };

  const getDayLabel = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  const getDayColor = (day: string) => {
    const colorMap: Record<string, string> = {
      MONDAY: "primary",
      TUESDAY: "success",
      WEDNESDAY: "neutral",
      THURSDAY: "warning",
      FRIDAY: "danger",
      SATURDAY: "secondary",
      SUNDAY: "success",
    };
    return colorMap[day];
  };

  return (
    <Sheet variant="outlined" sx={{ borderRadius: "sm", mt: 1 }}>
      <List size="sm">
        {schedules?.length === 0 ? (
          <ListItem>
            <ListItemContent>
              <Typography level="body-xs">Tidak ada jadwal tersedia</Typography>
            </ListItemContent>
          </ListItem>
        ) : (
          schedules?.map((schedule) => (
            <ListItem
              key={schedule.id}
              endAction={
                <Stack direction="row" spacing={1} mr={1}>
                  <Link
                    level="body-xs"
                    color="secondary"
                    disabled={isLoading}
                    onClick={() => onEdit(schedule)}
                  >
                    Edit
                  </Link>
                  <Link
                    level="body-xs"
                    color="danger"
                    disabled={isLoading}
                    onClick={() => onDelete(schedule.id)}
                  >
                    Hapus
                  </Link>
                </Stack>
              }
            >
              <ListItemButton>
                <ListItemDecorator>
                  <CalendarMonthRounded />
                </ListItemDecorator>
                <ListItemContent>
                  <Chip
                    color={getDayColor(schedule.day) as any}
                    size="sm"
                    variant="soft"
                  >
                    {getDayLabel(schedule.day)}
                  </Chip>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <AccessTimeRounded
                      sx={{ mr: 0.5, opacity: 0.7, fontSize: 13 }}
                    />
                    <Typography level="body-xs">
                      {formatTime(schedule.startTime as unknown as string)} -{" "}
                      {formatTime(schedule.endTime as unknown as string)}
                    </Typography>
                  </div>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Sheet>
  );
};

export default ListSchedule;
