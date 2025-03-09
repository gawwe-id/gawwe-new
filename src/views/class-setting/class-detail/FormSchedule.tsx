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
import { useTranslation } from "react-i18next";

interface FormScheduleProps {
  classId: string;
}

const FormSchedule = ({ classId }: FormScheduleProps) => {
  const { t } = useTranslation("class");
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
        showSnackbar(t("notifications.scheduleCreated"), "success");
      },
      (error) => {
        showSnackbar(
          t("notifications.error", { message: error.message }),
          "danger"
        );
      }
    );

  const { mutate: updateSchedule, isPending: isUpdating } =
    useUpdateClassSchedule(
      () => {
        resetForm();
        showSnackbar(t("notifications.scheduleUpdated"), "success");
      },
      (error) => {
        showSnackbar(
          t("notifications.error", { message: error.message }),
          "danger"
        );
      }
    );

  const { mutate: deleteSchedule, isPending: isDeleteing } =
    useDeleteClassSchedule(
      () => {
        showSnackbar(t("notifications.scheduleDeleted"), "success");
      },
      (error) => {
        showSnackbar(
          t("notifications.error", { message: error.message }),
          "danger"
        );
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

  // Map ScheduleDay enum values to translation keys
  const getDayTranslation = (day: string) => {
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
        <Typography level="title-lg">{t("schedule.title")}</Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box mb={2}>
        <Typography level="title-md">
          {t("classSetting.classesSection.schedule")}
        </Typography>
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
              <FormLabel>{t("schedule.form.day")}</FormLabel>
              <Controller
                name="day"
                control={control}
                rules={{ required: t("schedule.form.dayRequired") }}
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
                        {getDayTranslation(d)}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {isDayDuplicate && !editingSchedule && (
                <FormHelperText>
                  {t("schedule.form.dayDuplicate")}
                </FormHelperText>
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
              <FormLabel>{t("common.time.startTime")}</FormLabel>
              <Controller
                name="startTime"
                control={control}
                rules={{ required: t("schedule.form.startTimeRequired") }}
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
                    placeholderText={t("schedule.form.selectTime")}
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
              <FormLabel>{t("common.time.endTime")}</FormLabel>
              <Controller
                name="endTime"
                control={control}
                rules={{ required: t("schedule.form.endTimeRequired") }}
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
                    placeholderText={t("schedule.form.selectTime")}
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
              t("schedule.form.updateSchedule")
            ) : (
              t("schedule.form.addSchedule")
            )}
          </Button>

          {editingSchedule && (
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={resetForm}
            >
              {t("schedule.form.cancelEdit")}
            </Button>
          )}
        </Stack>
      </form>
    </Card>
  );
};

export default FormSchedule;
