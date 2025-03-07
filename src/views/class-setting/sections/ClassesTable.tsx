"use client";

import {
  Box,
  Chip,
  IconButton,
  Sheet,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import {
  CalendarMonthRounded,
  VisibilityRounded as VisibilityIcon,
} from "@mui/icons-material";

interface ClassesTableProps {
  classes: Array<{
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
  }>;
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

export default function ClassesTable({ classes }: ClassesTableProps) {
  const router = useRouter();

  return (
    <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
      <Table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Nama Kelas</th>
            <th style={{ width: "15%" }}>Batch</th>
            <th style={{ width: "30%" }}>Jadwal</th>
            <th style={{ width: "15%", textAlign: "center" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td>
                <Typography
                  component="span"
                  fontWeight="medium"
                  level="body-xs"
                >
                  {classItem.name}
                </Typography>
              </td>
              <td>
                <Chip size="sm" variant="soft" color="secondary">
                  Batch {classItem.batch}
                </Chip>
              </td>
              <td>
                {/* General Schedule */}
                <Typography
                  component="span"
                  fontWeight="medium"
                  level="body-xs"
                  sx={{ display: "block", mb: 1 }}
                >
                  {classItem.schedule}
                </Typography>

                {/* Schedule Days */}
                {classItem.schedules && classItem.schedules.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      alignItems: "center",
                    }}
                  >
                    <CalendarMonthRounded
                      fontSize="small"
                      sx={{ color: "primary.500", mr: 0.5 }}
                    />
                    {classItem.schedules.map((schedule, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        variant="soft"
                        color="primary"
                        slotProps={{ root: { sx: { fontSize: "0.7rem" } } }}
                      >
                        {formatDayName(schedule.day)}
                      </Chip>
                    ))}
                  </Box>
                )}
              </td>
              <td>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  <Tooltip title="Detail Kelas">
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={() =>
                        router.push(`/class-setting/${classItem.id}`)
                      }
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
