"use client";

import React, { useState } from "react";
import {
  Button,
  Typography,
  CircularProgress,
  FormControl,
  FormLabel,
  Select,
  Option,
  Stack,
  Chip,
  IconButton,
  Card,
} from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  useClassSchedules,
  useCreateClassSchedule,
  useUpdateClassSchedule,
  useDeleteClassSchedule,
  formatSchedule,
} from "@/hooks/useClassSchedule";
import { ScheduleDay } from "@/server/db/schema/classSchedules";

interface ClassScheduleManagerProps {
  classId: string;
  readOnly?: boolean;
}

const ClassScheduleManager: React.FC<ClassScheduleManagerProps> = ({
  classId,
  readOnly = false,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [day, setDay] = useState<ScheduleDay>(ScheduleDay.MONDAY);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");

  const { data: schedulesData, isLoading } = useClassSchedules(classId);

  const { mutate: createSchedule, isPending: isCreating } =
    useCreateClassSchedule(
      () => {
        resetForm();
      },
      (error) => {
        console.error("Failed to create schedule:", error);
        // Show error notification
      }
    );

  const { mutate: updateSchedule, isPending: isUpdating } =
    useUpdateClassSchedule(
      () => {
        resetForm();
      },
      (error) => {
        console.error("Failed to update schedule:", error);
        // Show error notification
      }
    );

  const { mutate: deleteSchedule } = useDeleteClassSchedule(
    () => {
      // No need to do anything specific on success
    },
    (error) => {
      console.error("Failed to delete schedule:", error);
      // Show error notification
    }
  );

  const resetForm = () => {
    setShowForm(false);
    setEditingSchedule(null);
    setDay(ScheduleDay.MONDAY);
    setStartTime("08:00");
    setEndTime("10:00");
  };

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setShowForm(true);
  };

  const handleEditSchedule = (schedule: any) => {
    setEditingSchedule(schedule);
    setDay(schedule.day);

    // Format startTime and endTime (assuming they come in as HH:MM:SS)
    const formatTime = (time: string) => {
      return time.substring(0, 5); // Get just HH:MM
    };

    setStartTime(formatTime(schedule.startTime));
    setEndTime(formatTime(schedule.endTime));
    setShowForm(true);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      deleteSchedule({ scheduleId, classId });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add seconds to the time for PostgreSQL time format
    const formatTimeForDB = (time: string) => {
      return `${time}:00`;
    };

    if (editingSchedule) {
      updateSchedule({
        scheduleId: editingSchedule.id,
        classId,
        updateSchedule: {
          startTime: formatTimeForDB(startTime),
          endTime: formatTimeForDB(endTime),
        },
      });
    } else {
      createSchedule({
        classId,
        day,
        startTime: formatTimeForDB(startTime),
        endTime: formatTimeForDB(endTime),
      });
    }
  };

  // Check if a day is already scheduled
  const isDayScheduled = (checkDay: ScheduleDay) => {
    return schedulesData?.data?.some(
      (schedule: any) => schedule.day === checkDay
    );
  };

  // Filter out days that already have schedules (except when editing)
  const availableDays = Object.values(ScheduleDay).filter(
    (d) => !isDayScheduled(d) || (editingSchedule && editingSchedule.day === d)
  );

  return (
    <Card sx={{ mt: 3 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <Typography level="title-lg">Jadwal Kelas</Typography>
        {!readOnly && (
          <Button
            onClick={handleAddSchedule}
            disabled={availableDays.length === 0 || showForm}
          >
            Tambah Jadwal
          </Button>
        )}
      </div>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {!schedulesData?.data || schedulesData.data.length === 0 ? (
            <Typography>Belum ada jadwal yang ditambahkan.</Typography>
          ) : (
            <Stack spacing={1} direction="row" flexWrap="wrap" useFlexGap>
              {schedulesData.data.map((schedule: any) => (
                <Chip
                  key={schedule.id}
                  color="primary"
                  variant="soft"
                  endDecorator={
                    !readOnly && (
                      <>
                        <IconButton
                          variant="plain"
                          color="neutral"
                          size="sm"
                          onClick={() => handleEditSchedule(schedule)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          variant="plain"
                          color="danger"
                          size="sm"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    )
                  }
                >
                  {formatSchedule(schedule)}
                </Chip>
              ))}
            </Stack>
          )}
        </>
      )}

      {showForm && !readOnly && (
        <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Hari</FormLabel>
              <Select
                value={day}
                onChange={(_, value) => value && setDay(value as ScheduleDay)}
                disabled={!!editingSchedule}
              >
                {availableDays.map((d) => (
                  <Option key={d} value={d}>
                    {d.charAt(0) + d.slice(1).toLowerCase()}
                  </Option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Waktu Mulai</FormLabel>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #ccc",
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Waktu Selesai</FormLabel>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #ccc",
                }}
              />
            </FormControl>

            <Stack direction="row" spacing={1}>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating ? (
                  <CircularProgress size="sm" />
                ) : editingSchedule ? (
                  "Update"
                ) : (
                  "Simpan"
                )}
              </Button>
              <Button variant="outlined" color="neutral" onClick={resetForm}>
                Batal
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Card>
  );
};

export default ClassScheduleManager;
