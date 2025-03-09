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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("class");

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
    const dayMap: Record<string, string> = {
      SENIN: t("schedule.days.monday"),
      SELASA: t("schedule.days.tuesday"),
      RABU: t("schedule.days.wednesday"),
      KAMIS: t("schedule.days.thursday"),
      JUMAT: t("schedule.days.friday"),
      SABTU: t("schedule.days.saturday"),
      MINGGU: t("schedule.days.sunday"),
    };

    return dayMap[day] || day.charAt(0) + day.slice(1).toLowerCase();
  };

  const getDayColor = (day: string) => {
    const colorMap: Record<string, string> = {
      SENIN: "primary",
      SELASA: "success",
      RABU: "neutral",
      KAMIS: "warning",
      JUMAT: "danger",
      SABTU: "secondary",
      MINGGU: "success",
    };
    return colorMap[day];
  };

  return (
    <Sheet variant="outlined" sx={{ borderRadius: "sm", mt: 1 }}>
      <List size="sm">
        {schedules?.length === 0 ? (
          <ListItem>
            <ListItemContent>
              <Typography level="body-xs">
                {t("schedule.noSchedules")}
              </Typography>
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
                    {t("common.actions.edit")}
                  </Link>
                  <Link
                    level="body-xs"
                    color="danger"
                    disabled={isLoading}
                    onClick={() => onDelete(schedule.id)}
                  >
                    {t("common.actions.delete")}
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
