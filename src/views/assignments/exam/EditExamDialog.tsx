"use client";

import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
  Grid,
  Option,
  Select,
  Textarea,
  Input,
  Box,
  Typography,
  Switch,
} from "@mui/joy";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import {
  DateRangeRounded,
  EditRounded,
  ScheduleRounded,
} from "@mui/icons-material";
import { useExamStore } from "@/store/examStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useEffect } from "react";
import { updateExamSchema } from "@/server/db/schema/exams";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Class = {
  id: string;
  name: string;
  description: string;
  schedules: {
    id: string;
    classId: string;
    day: string;
    startTime: string;
    endTime: string;
  }[];
  languageClassId: string;
  batch: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ExamUpdateValues = z.infer<typeof updateExamSchema>;

interface EditExamDialogProps {
  classes: Class[] | undefined;
}

export default function EditExamDialog({ classes }: EditExamDialogProps) {
  const { t } = useTranslation("assignment");
  const queryClient = useQueryClient();
  const { isEditOpen, closeEdit, editId } = useExamStore();

  // Fetch the exam being edited
  const { data: examData, isLoading: isLoadingExam } = useQuery({
    queryKey: ["exam", editId],
    queryFn: async () => {
      if (!editId) return null;
      const res = await client.exams.byId.$get({
        examId: editId,
      });
      return res.json();
    },
    enabled: !!editId && isEditOpen,
  });

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ExamUpdateValues>({
    resolver: zodResolver(updateExamSchema),
    defaultValues: {
      title: examData?.data?.title,
      classId: examData?.data?.classId ?? null ?? undefined,
      description: examData?.data?.description ?? "",
      calendarId: examData?.data?.calendarId,
      examDate: examData?.data?.examDate,
      startTime: examData?.data?.startTime,
      endTime: examData?.data?.endTime,
      isOnline: examData?.data?.isOnline ?? false,
      status: examData?.data?.status ?? undefined,
      link: examData?.data?.link,
      // isPublished: examData?.data?.isPubished ?? false,
    },
  });

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const isOnline = watch("isOnline");

  // Populate form when exam data is loaded
  useEffect(() => {
    if (examData?.data && !isLoadingExam) {
      const exam = examData.data;

      reset({
        ...exam,
        description: exam.description ?? undefined,
        link: exam.link ?? undefined,
        classId: exam.classId ?? undefined,
        isOnline: exam.isOnline ?? undefined,
        status: exam.status ?? undefined,
      });
    }
  }, [examData, isLoadingExam, reset]);

  // Mutation for updating exam
  const { mutate: updateExam, isPending: isUpdating } = useMutation({
    mutationFn: async (data: ExamUpdateValues) => {
      if (!editId) throw new Error("No exam ID provided");

      const res = await client.exams.update.$post({
        examId: editId,
        data,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      closeEdit();
    },
  });

  const onSubmit = (data: ExamUpdateValues) => {
    if (data.startTime && data.endTime) {
      if (dayjs(data.endTime).isBefore(dayjs(data.startTime))) {
        console.error("End time is before start time!");
        return;
      }
    }

    updateExam(data);
  };

  const handleClose = () => {
    reset();
    closeEdit();
  };

  const loading = isUpdating || isLoadingExam;

  return (
    <Modal open={isEditOpen} onClose={loading ? undefined : handleClose}>
      <ModalDialog size="lg" sx={{ maxWidth: 700, width: "100%" }}>
        <ModalClose disabled={loading} />
        <Typography
          id="exam-edit-modal-title"
          level="h4"
          component="h2"
          startDecorator={<EditRounded />}
        >
          {t("exam.actions.edit")}
        </Typography>
        <Divider sx={{ my: 2 }} />

        {isLoadingExam ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography>{t("exam.page.loading")}</Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControl error={!!errors.title}>
                      <FormLabel>{t("exam.form.title")}</FormLabel>
                      <Input
                        {...field}
                        fullWidth
                        size="sm"
                        disabled={loading}
                      />
                      {errors.title && (
                        <FormHelperText>{errors.title.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>{t("exam.form.description")}</FormLabel>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        minRows={3}
                        disabled={loading}
                      />
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <FormControl error={!!errors.examDate}>
                  <FormLabel>{t("exam.form.date")}</FormLabel>
                  <Controller
                    name="examDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        dateFormat="MMMM d, yyyy"
                        placeholderText={t("exam.form.date")}
                        disabled={loading}
                        customInput={
                          <Input
                            startDecorator={<DateRangeRounded />}
                            sx={{ width: "100%" }}
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
                {errors.examDate && (
                  <FormHelperText>{errors.examDate.message}</FormHelperText>
                )}
              </Grid>

              <Grid xs={12} md={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>{t("exam.form.status")}</FormLabel>
                      <Select
                        value={field.value}
                        onChange={(e, val) => field.onChange(val)}
                        disabled={loading}
                      >
                        <Option value="draft">{t("exam.status.draft")}</Option>
                        <Option value="published">
                          {t("exam.status.published")}
                        </Option>
                        <Option value="ongoing">
                          {t("exam.status.ongoing")}
                        </Option>
                        <Option value="completed">
                          {t("exam.status.completed")}
                        </Option>
                        <Option value="cancelled">
                          {t("exam.status.cancelled")}
                        </Option>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>{t("exam.form.startTime")}</FormLabel>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        placeholderText={t("exam.form.startTime")}
                        disabled={loading}
                        customInput={
                          <Input
                            startDecorator={<ScheduleRounded />}
                            sx={{ width: "100%" }}
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
                {startTime &&
                  endTime &&
                  dayjs(endTime).isBefore(dayjs(startTime)) && (
                    <FormHelperText sx={{ color: "danger.500" }}>
                      {t("exam.form.timeError")}
                    </FormHelperText>
                  )}
              </Grid>

              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>{t("exam.form.endTime")}</FormLabel>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        placeholderText={t("exam.form.endTime")}
                        disabled={loading}
                        customInput={
                          <Input
                            startDecorator={<ScheduleRounded />}
                            sx={{ width: "100%" }}
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid xs={12} md={6}>
                <Controller
                  name="classId"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>{t("exam.form.class")}</FormLabel>
                      <Select
                        placeholder={t("exam.form.selectClass")}
                        value={field.value || ""}
                        onChange={(e, val) => field.onChange(val)}
                        disabled={loading}
                      >
                        {classes?.map((classItem: Class) => (
                          <Option key={classItem.id} value={classItem.id}>
                            {classItem.name}
                          </Option>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>{t("exam.form.isOnline")}</FormLabel>
                  <Controller
                    name="isOnline"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value ?? false}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                        disabled={loading}
                        sx={{
                          "--Switch-trackWidth": "64px",
                          "--Switch-trackHeight": "34px",
                          "--Switch-thumbSize": "26px",
                          "--Switch-trackRadius": "18px",
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {isOnline && (
                <Grid xs={12} md={12}>
                  <FormControl error={!!errors.link}>
                    <FormLabel>{t("exam.form.link")}</FormLabel>
                    <Controller
                      name="link"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          fullWidth
                          size="sm"
                          disabled={loading}
                          placeholder="https://exam-meetup.com/"
                          value={field.value ?? ""}
                        />
                      )}
                    />
                    {errors.link && (
                      <FormHelperText>{errors.link.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
            </Grid>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                mt: 4,
              }}
            >
              <Button
                variant="plain"
                color="neutral"
                onClick={handleClose}
                disabled={loading}
              >
                {t("exam.form.cancel")}
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading || !isDirty}
                startDecorator={loading ? null : <EditRounded />}
              >
                {loading ? t("exam.form.updating") : t("exam.form.update")}
              </Button>
            </Box>
          </form>
        )}
      </ModalDialog>
    </Modal>
  );
}
