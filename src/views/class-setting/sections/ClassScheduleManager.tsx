"use client";

import { useEffect, useState } from "react";
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
            Kelas Berhasil Dibuat!
          </Typography>
        </Box>

        <Box mb={3}>
          <Typography level="title-md" sx={{ textDecoration: "underline" }}>
            {data?.name}
          </Typography>
          <Grid container mt={1}>
            <Grid xs={12} md={4}>
              <Typography level="title-sm">Batch</Typography>
              <Typography level="body-sm">Batch: {data?.batch}</Typography>
            </Grid>
            <Grid xs={12} md={4}>
              <Typography level="title-sm">Tanggal Mulai</Typography>
              <Typography level="body-sm">
                {formatDate(data?.startDate as Date)}
              </Typography>
            </Grid>
            <Grid xs={12} md={4}>
              <Typography level="title-sm">Tanggal Selesai</Typography>
              <Typography level="body-sm">
                {formatDate(data?.endDate as Date)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Typography level="title-md">Jadwal Kelas</Typography>
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
                  Belum ada Jadwal, tambahkan Jadwal sebelum kembali ke halaman
                  Pengaturan Kelas
                </Alert>
              ) : (
                <>
                  <Grid container mt={1}>
                    <Grid xs={12} md={3}>
                      <Typography level="title-sm">Hari</Typography>
                    </Grid>
                    <Grid xs={12} md={3}>
                      <Typography level="title-sm">Waktu Mulai</Typography>
                    </Grid>
                    <Grid xs={12} md={3}>
                      <Typography level="title-sm">Waktu Selesai</Typography>
                    </Grid>
                    <Grid xs={12} md={3}>
                      <Typography level="title-sm">Aksi</Typography>
                    </Grid>
                  </Grid>
                  {schedulesData?.data.map((schedule: ClassSchedule) => (
                    <Grid container key={schedule.id}>
                      <Grid xs={12} md={3}>
                        <Typography level="body-sm">
                          {schedule.day.charAt(0) +
                            schedule.day.slice(1).toLowerCase()}
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
                            Edit
                          </Link>
                          <Link
                            level="body-sm"
                            color="danger"
                            disabled={isCreating || isUpdating || isDeleteing}
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            Hapus
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
            {editingSchedule ? "Edit Jadwal Kelas" : "Tambah Jadwal Kelas"}
          </Typography>
        </Box>
        {!readOnly && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
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
                        startDecorator={<EventRounded />}
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
                    <FormHelperText>
                      Jadwal untuk hari ini sudah ada
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
                  "Update Jadwal"
                ) : (
                  "Tambah Jadwal"
                )}
              </Button>

              {editingSchedule && (
                <Button variant="outlined" color="neutral" onClick={resetForm}>
                  Batal Edit
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
            Kembali ke Pengaturan Kelas
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default ClassScheduleManager;
