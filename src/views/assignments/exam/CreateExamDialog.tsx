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
import { Controller, UseFormReturn } from "react-hook-form";
import {
  DateRangeRounded,
  PostAddRounded,
  ScheduleRounded,
} from "@mui/icons-material";
import { ExamFormValues } from ".";
import { useExamStore } from "@/store/examStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";

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

type Calendar = {
  id: string;
  classId: string;
  title: string;
  description: string;
  eventType: string;
  date: Date;
  isOnline: boolean;
  link: string | null;
};

interface CreateExamDialogProps {
  form: UseFormReturn<ExamFormValues>;
  classes: Class[] | undefined;
}

export default function CreateExamDialog({
  form,
  classes,
}: CreateExamDialogProps) {
  const { t } = useTranslation("assignment");
  const queryClient = useQueryClient();
  const { isModalOpen, closeModal } = useExamStore();

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = form;

  const startTime = watch("startTime");
  const endTime = watch("endTime");
  const isOnline = watch("isOnline");

  // Mutations
  const { mutate: createExam, isPending: isCreating } = useMutation({
    mutationFn: async (data: ExamFormValues) => {
      const res = await client.exams.create.$post({
        ...data,
        status: data.status as
          | "draft"
          | "published"
          | "ongoing"
          | "completed"
          | "cancelled"
          | null
          | undefined,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      closeModal();
    },
  });

  const onSubmit = (data: ExamFormValues) => {
    if (data.startTime && data.endTime) {
      if (dayjs(data.endTime).isBefore(dayjs(data.startTime))) {
        console.error("End time is before start time!");
        return;
      }
    }

    createExam(data);
  };

  const handleClose = () => {
    reset();
    closeModal();
  };

  const loading = isCreating;

  return (
    <Modal open={isModalOpen} onClose={loading ? undefined : handleClose}>
      <ModalDialog size="lg" sx={{ maxWidth: 700, width: "100%" }}>
        <ModalClose disabled={loading} />
        <Typography
          id="assignment-modal-title"
          level="h4"
          component="h2"
          startDecorator={<PostAddRounded />}
        >
          {t("exam.actions.create")}
        </Typography>
        <Divider />
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
                    <Input {...field} fullWidth size="sm" disabled={loading} />
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
                    <Textarea {...field} minRows={3} disabled={loading} />
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
                    End time must be after start time
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
                      placeholder="Select class"
                      value={field.value || ""}
                      onChange={(e, val) => field.onChange(val)}
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
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
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
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 4 }}
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
              startDecorator={loading ? null : <PostAddRounded />}
            >
              {loading ? t("exam.form.creating") : t("exam.form.create")}
            </Button>
          </Box>
        </form>
      </ModalDialog>
    </Modal>
  );
}
