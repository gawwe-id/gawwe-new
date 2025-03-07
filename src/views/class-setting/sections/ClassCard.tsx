"use client";

import { useRouter } from "next/navigation";
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

const formatDayName = (day: string) => {
  const days: Record<string, string> = {
    SENIN: "Senin",
    SELASA: "Selasa",
    RABU: "Rabu",
    KAMIS: "Kamis",
    JUMAT: "Jumat",
    SABTU: "Sabtu",
    MINGGU: "Minggu",
  };
  return days[day] || day;
};

export default function ClassCard({ classItem }: ClassCardProps) {
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
            Batch {classItem.batch}
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
              Jadwal Hari:
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
                  {formatDayName(schedule.day)}
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
            Detail
          </Button>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}
