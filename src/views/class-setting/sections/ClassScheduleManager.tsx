"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Typography,
  CircularProgress,
  FormControl,
  FormLabel,
  Select,
  Option,
  Stack,
  Card,
  Box,
  Grid,
  Divider,
  FormHelperText,
  Input,
  Link,
  Alert,
} from "@mui/joy";
import {
  useClassSchedules,
  useCreateClassSchedule,
  useUpdateClassSchedule,
  useDeleteClassSchedule,
} from "@/hooks/useClassSchedule";
import { ClassSchedule, ScheduleDay } from "@/server/db/schema/classSchedules";
import {
  ArrowBackRounded,
  CheckCircleRounded,
  EventRounded,
  InfoRounded,
  MoreTimeRounded,
  ScheduleRounded,
} from "@mui/icons-material";
import { Class } from "@/server/db/schema/classes";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/hooks/useSnackbar";

interface ClassScheduleManagerProps {
  classId: string;
  data: Class | undefined;
  readOnly?: boolean;
}

const ClassScheduleManager: React.FC<ClassScheduleManagerProps> = ({
  classId,
  data,
  readOnly = false,
}) => {
  const { t } = useTranslation("class");
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [editingSchedule, setEditingSchedule] = useState<any>(null);

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

  const { data: schedulesData, isLoading } = useClassSchedules(classId);

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

  useEffect(() => {
    if (editingSchedule) {
      const formatTime = (time: string) => {
        return time.substring(0, 5);
      };

      reset({
        day: editingSchedule.day,
        startTime: formatTime(editingSchedule.startTime),
        endTime: formatTime(editingSchedule.endTime),
      });
    }
  }, [editingSchedule, reset]);

  const handleEditSchedule = (schedule: ClassSchedule) => {
    setEditingSchedule(schedule);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    deleteSchedule({ scheduleId, classId });
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

  const isDayScheduled = (checkDay: ScheduleDay) => {
    return schedulesData?.data?.some(
      (schedule: any) => schedule.day === checkDay
    );
  };

  const isDayDuplicate = isDayScheduled(watchDay as ScheduleDay);

  const availableDays = Object.values(ScheduleDay).filter(
    (d) => !isDayScheduled(d) || (editingSchedule && editingSchedule.day === d)
  );

  const formatDate = (dateString: Date) => {
    return dayjs(dateString).format("D MMMM YYYY");
  };

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

  const formatDayName = (day: string) => {
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

  const handleBack = () => router.back();

  return (
    <>
      <Card
        sx={{ mt: 3, mb: 3, borderWidth: 2 }}
        color="success"
        variant="outlined"
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <CheckCircleRounded color="success" sx={{ mr: 1, fontSize: 24 }} />
          <Typography level="title-sm" color="success">
            {t("createClass.success.title")}
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography level="title-md" sx={{ textDecoration: "underline" }}>
            {data?.name}
          </Typography>
          <Grid container mt={1}>
            <Grid xs={12} md={4}>
              <Typography level="title-sm">
                {t("classSetting.classesSection.batch", { number: "" })}
              </Typography>
              <Typography level="body-sm">
                {t("classSetting.classesSection.batch", {
                  number: data?.batch,
                })}
              </Typography>
            </Grid>
            <Grid xs={12} md={4}>
              <Typography level="title-sm">
                {t("createClass.form.startDate")}
              </Typography>
              <Typography level="body-sm">
                {formatDate(data?.startDate as Date)}
              </Typography>
            </Grid>
            <Grid xs={12} md={4}>
              <Typography level="title-sm">
                {t("createClass.form.endDate")}
              </Typography>
              <Typography level="body-sm">
                {formatDate(data?.endDate as Date)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography level="title-md">{t("schedule.title")}</Typography>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              {!schedulesData?.data || schedulesData.data.length === 0 ? (
                <Alert
                  size="sm"
                  color="danger"
                  variant="plain"
                  startDecorator={<InfoRounded />}
                  sx={{ mt: 1 }}
                >
                  {t("createClass.success.scheduleNote")}
                </Alert>
              ) : (
                <>
                  <Grid container mt={1}>
                    <Grid xs={12} md={3}>
                      <Typography level="title-sm">
                        {t("schedule.form.day")}
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={3}>
                      <Typography level="title-sm">
                        {t("common.time.startTime")}
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={3}>
                      <Typography level="title-sm">
                        {t("common.time.endTime")}
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={3}>
                      <Typography level="title-sm">
                        {t("common.actions.add")}
                      </Typography>
                    </Grid>
                  </Grid>
                  {schedulesData?.data.map((schedule: ClassSchedule) => (
                    <Grid container key={schedule.id}>
                      <Grid xs={12} md={3}>
                        <Typography level="body-sm">
                          {formatDayName(schedule.day)}
                        </Typography>
                      </Grid>
                      <Grid xs={12} md={3}>
                        <Typography level="body-sm">
                          {schedule.startTime}
                        </Typography>
                      </Grid>
                      <Grid xs={12} md={3}>
                        <Typography level="body-sm">
                          {schedule.endTime}
                        </Typography>
                      </Grid>
                      <Grid xs={12} md={3}>
                        <Stack direction="row" spacing={2}>
                          <Link
                            level="body-sm"
                            color="secondary"
                            disabled={isCreating || isUpdating || isDeleteing}
                            onClick={() => handleEditSchedule(schedule)}
                          >
                            {t("common.actions.edit")}
                          </Link>
                          <Link
                            level="body-sm"
                            color="danger"
                            disabled={isCreating || isUpdating || isDeleteing}
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            {t("common.actions.delete")}
                          </Link>
                        </Stack>
                      </Grid>
                    </Grid>
                  ))}
                </>
              )}
            </>
          )}
        </Box>
      </Card>

      <Card>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography level="title-lg">
            {editingSchedule
              ? t("schedule.form.editTitle")
              : t("schedule.form.title")}
          </Typography>
        </Box>
        {!readOnly && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
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
                        startDecorator={<EventRounded />}
                      >
                        {availableDays.map((d) => (
                          <Option key={d} value={d}>
                            {formatDayName(d)}
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
                        customInput={
                          <Input
                            size="sm"
                            fullWidth
                            startDecorator={<ScheduleRounded />}
                          />
                        }
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
                        customInput={
                          <Input
                            size="sm"
                            fullWidth
                            startDecorator={<ScheduleRounded />}
                          />
                        }
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
                type="submit"
                disabled={
                  isCreating ||
                  isUpdating ||
                  isDeleteing ||
                  (isDayDuplicate && !editingSchedule)
                }
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
                <Button variant="outlined" color="neutral" onClick={resetForm}>
                  {t("schedule.form.cancelEdit")}
                </Button>
              )}
            </Stack>
          </form>
        )}

        <Divider sx={{ my: 1 }} />

        {/* Back Button */}
        <Box display="flex" justifyContent="center">
          <Button
            startDecorator={<ArrowBackRounded />}
            onClick={handleBack}
            variant="plain"
            disabled={schedulesData?.data?.length === 0}
            sx={{ ":hover": { textDecoration: "underline" } }}
          >
            {t("common.actions.back")} {t("classSetting.pageTitle")}
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default ClassScheduleManager;
