"use client";

import {
  useClassSchedules,
  useCreateClassSchedule,
  useDeleteClassSchedule,
  useUpdateClassSchedule,
} from "@/hooks/useClassSchedule";
import { useSnackbar } from "@/hooks/useSnackbar";
import { ClassSchedule, ScheduleDay } from "@/server/db/schema/classSchedules";
import { EventRounded, MoreTimeRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import ListSchedule from "./ListSchedule";

interface FormScheduleProps {
  classId: string;
}

const FormSchedule = ({ classId }: FormScheduleProps) => {
  const { showSnackbar } = useSnackbar();

  const [editingSchedule, setEditingSchedule] = useState<null | ClassSchedule>(
    null
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ClassSchedule>({
    defaultValues: {
      day: ScheduleDay.SENIN,
      startTime: "08:00",
      endTime: "10:00",
    },
  });

  const watchDay = watch("day");

  const { data: schedulesData, isLoading: isSchedule } =
    useClassSchedules(classId);

  const { mutate: createSchedule, isPending: isCreating } =
    useCreateClassSchedule(
      () => {
        resetForm();
        showSnackbar("Berhasil membuat jadwal", "success");
      },
      (error) => {
        showSnackbar(error.message, "danger");
      }
    );

  const { mutate: updateSchedule, isPending: isUpdating } =
    useUpdateClassSchedule(
      () => {
        resetForm();
        showSnackbar("Berhasil mengubah jadwal", "success");
      },
      (error) => {
        showSnackbar(error.message, "danger");
      }
    );

  const { mutate: deleteSchedule, isPending: isDeleteing } =
    useDeleteClassSchedule(
      () => {
        showSnackbar("Berhasil menghapus jadwal", "success");
      },
      (error) => {
        showSnackbar(error.message, "danger");
      }
    );

  const resetForm = () => {
    reset({
      day: "",
      startTime: "08:00",
      endTime: "10:00",
    });
    setEditingSchedule(null);
  };

  const handleEditSchedule = (schedule: ClassSchedule) => {
    setEditingSchedule(schedule);
    reset(schedule);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    deleteSchedule({ scheduleId, classId });
  };

  const isDayScheduled = (checkDay: ScheduleDay) => {
    return schedulesData?.data?.some(
      (schedule: any) => schedule.day === checkDay
    );
  };

  const isDayDuplicate = isDayScheduled(watchDay as ScheduleDay);

  const availableDays = Object.values(ScheduleDay).filter(
    (d) => !isDayScheduled(d) || (editingSchedule && editingSchedule.day === d)
  );

  const timeStringToDate = (timeStr: string) => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(":");
    now.setHours(parseInt(hours || "0", 10));
    now.setMinutes(parseInt(minutes || "0", 10));
    now.setSeconds(0);
    return now;
  };

  const dateToTimeString = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:00`;
  };

  const onSubmit = (data: ClassSchedule) => {
    if (editingSchedule) {
      updateSchedule({
        scheduleId: editingSchedule.id,
        classId,
        updateSchedule: {
          startTime: data.startTime,
          endTime: data.endTime,
        },
      });
    } else {
      createSchedule({
        classId,
        day: data.day as ScheduleDay,
        startTime: data.startTime,
        endTime: data.endTime,
      });
    }
  };

  const isLoading = isCreating || isUpdating || isDeleteing;

  return (
    <Card>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <EventRounded sx={{ mr: 1, fontSize: 22 }} />
        <Typography level="title-lg">Class Schedules</Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box mb={2}>
        <Typography level="title-md">Jadwal Kelas</Typography>
        {isSchedule ? (
          <Stack height={50} justifyContent="center" alignItems="center">
            <CircularProgress size="sm" />
          </Stack>
        ) : (
          <ListSchedule
            schedules={schedulesData?.data}
            onEdit={handleEditSchedule}
            onDelete={handleDeleteSchedule}
            isLoading={isLoading}
          />
        )}
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid xs={12} md={4}>
            <FormControl error={isDayDuplicate && !editingSchedule}>
              <FormLabel>Hari</FormLabel>
              <Controller
                name="day"
                control={control}
                rules={{ required: "Hari harus dipilih" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    disabled={!!editingSchedule}
                    value={field.value}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        field.onChange(newValue);
                      }
                    }}
                    size="sm"
                  >
                    {availableDays.map((d) => (
                      <Option key={d} value={d}>
                        {d.charAt(0) + d.slice(1).toLowerCase()}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {isDayDuplicate && !editingSchedule && (
                <FormHelperText>Jadwal untuk hari ini sudah ada</FormHelperText>
              )}
              {errors.day && (
                <Typography level="body-xs" color="danger">
                  * {errors.day.message}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid xs={12} md={4}>
            <FormControl>
              <FormLabel>Waktu Mulai</FormLabel>
              <Controller
                name="startTime"
                control={control}
                rules={{ required: "Waktu mulai harus diisi" }}
                render={({ field }) => (
                  <DatePicker
                    selected={timeStringToDate(field.value)}
                    onChange={(date) => {
                      if (date) {
                        field.onChange(dateToTimeString(date));
                      }
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    placeholderText="Pilih Waktu"
                    showTimeCaption={false}
                    customInput={<Input size="sm" fullWidth />}
                  />
                )}
              />
            </FormControl>
            {errors.startTime && (
              <Typography level="body-xs" color="danger">
                * {errors.startTime.message}
              </Typography>
            )}
          </Grid>

          <Grid xs={12} md={4}>
            <FormControl>
              <FormLabel>Waktu Selesai</FormLabel>
              <Controller
                name="endTime"
                control={control}
                rules={{ required: "Waktu selesai harus diisi" }}
                render={({ field }) => (
                  <DatePicker
                    selected={timeStringToDate(field.value)}
                    onChange={(date) => {
                      if (date) {
                        field.onChange(dateToTimeString(date));
                      }
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    placeholderText="Pilih Waktu"
                    showTimeCaption={false}
                    customInput={<Input size="sm" fullWidth />}
                  />
                )}
              />
            </FormControl>
            {errors.endTime && (
              <Typography level="body-xs" color="danger">
                * {errors.endTime.message}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            size="sm"
            type="submit"
            disabled={isLoading || (isDayDuplicate && !editingSchedule)}
            color={editingSchedule ? "primary" : "success"}
            startDecorator={<MoreTimeRounded />}
          >
            {isCreating || isUpdating ? (
              <CircularProgress size="sm" />
            ) : editingSchedule ? (
              "Update Jadwal"
            ) : (
              "Tambah Jadwal"
            )}
          </Button>

          {editingSchedule && (
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={resetForm}
            >
              Batal Edit
            </Button>
          )}
        </Stack>
      </form>
    </Card>
  );
};

export default FormSchedule;
