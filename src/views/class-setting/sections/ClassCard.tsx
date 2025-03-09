"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
  Typography,
} from "@mui/joy";

// assets
import {
  CalendarMonthRounded,
  SchoolRounded as SchoolIcon,
} from "@mui/icons-material";

interface ClassCardProps {
  classItem: {
    id: string;
    name: string;
    batch: number;
    schedule: string;
    schedules?: Array<{
      id: string;
      classId: string;
      day: string;
      startTime: string;
      endTime: string;
    }>;
  };
}

const formatDayName = (day: string, t: any) => {
  const dayMap: Record<string, string> = {
    SENIN: t("schedule.days.monday"),
    SELASA: t("schedule.days.tuesday"),
    RABU: t("schedule.days.wednesday"),
    KAMIS: t("schedule.days.thursday"),
    JUMAT: t("schedule.days.friday"),
    SABTU: t("schedule.days.saturday"),
    MINGGU: t("schedule.days.sunday"),
  };
  return dayMap[day] || day;
};

export default function ClassCard({ classItem }: ClassCardProps) {
  const { t } = useTranslation("class");
  const router = useRouter();

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "md",
          borderColor: "primary.300",
        },
        overflow: "hidden",
      }}
    >
      <CardOverflow>
        <AspectRatio ratio="16/9">
          <Box
            sx={{
              backgroundColor: "primary.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolIcon sx={{ fontSize: 40, color: "primary.600" }} />
          </Box>
        </AspectRatio>
      </CardOverflow>

      <CardContent>
        <Typography level="title-md">{classItem.name}</Typography>
        <Box sx={{ display: "flex", gap: 1, my: 1 }}>
          <Chip size="sm" variant="soft" color="secondary">
            {t("classSetting.classesSection.batch", {
              number: classItem.batch,
            })}
          </Chip>
        </Box>
        <Typography level="body-sm" sx={{ color: "text.secondary", mb: 1 }}>
          {classItem.schedule}
        </Typography>

        {/* Schedule Days */}
        {classItem.schedules && classItem.schedules.length > 0 && (
          <Box>
            <Typography
              level="body-xs"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mb: 0.5,
                color: "text.secondary",
              }}
            >
              <CalendarMonthRounded fontSize="small" />
              {t("classSetting.classesSection.scheduleDay")}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {classItem.schedules.map((schedule, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="soft"
                  color="primary"
                  slotProps={{ root: { sx: { fontSize: "0.75rem" } } }}
                >
                  {formatDayName(schedule.day, t)}
                </Chip>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>

      <CardOverflow variant="soft">
        <CardActions>
          <Button
            variant="plain"
            color="primary"
            onClick={() => router.push(`/class-setting/${classItem.id}`)}
            sx={{ flex: 1 }}
          >
            {t("common.actions.detail")}
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}
