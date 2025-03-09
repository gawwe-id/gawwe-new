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
import { useTranslation } from "react-i18next";

// assets
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

export default function ClassesTable({ classes }: ClassesTableProps) {
  const { t } = useTranslation("class");
  const router = useRouter();

  return (
    <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
      <Table>
        <thead>
          <tr>
            <th style={{ width: "40%" }}>
              {t("classSetting.classesSection.tableName")}
            </th>
            <th style={{ width: "15%" }}>
              {t("classSetting.classesSection.tableBatch")}
            </th>
            <th style={{ width: "30%" }}>
              {t("classSetting.classesSection.tableSchedule")}
            </th>
            <th style={{ width: "15%", textAlign: "center" }}>
              {t("classSetting.classesSection.tableAction")}
            </th>
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
                  {t("classSetting.classesSection.batch", {
                    number: classItem.batch,
                  })}
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
                        {formatDayName(schedule.day, t)}
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
