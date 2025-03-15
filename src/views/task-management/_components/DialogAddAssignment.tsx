import { client } from "@/lib/client";
import { useTaskManagementStore } from "@/store/taskManagementStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddRounded,
  CalendarMonthRounded,
  DateRangeRounded,
  DeleteRounded,
  QuizRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Typography,
} from "@mui/joy";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

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

// Form schema with zod validation
const assignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  classId: z.string().uuid("Please select a class"),
  dueDate: z.date(),
  calendarId: z.string().uuid().optional().nullable(),
  hasQuiz: z.boolean().optional(),
  hasEssay: z.boolean().optional(),
  quizTitle: z.string().optional(),
  quizDescription: z.string().optional(),
  essayQuestions: z
    .array(
      z.object({
        questionText: z.string(),
        maxWords: z.number().optional(),
      })
    )
    .optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

interface DialogAddAssignmentProps {
  classes: Class[] | undefined;
  calendars: Calendar[] | undefined;
}

const DialogAddAssignment = ({
  classes,
  calendars,
}: DialogAddAssignmentProps) => {
  const { t } = useTranslation("assignment");
  const queryClient = useQueryClient();
  const { isModalOpen, editId, closeModal } = useTaskManagementStore();

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      calendarId: null,
      hasQuiz: false,
      hasEssay: false,
      essayQuestions: [],
    },
  });

  const hasQuiz = watch("hasQuiz");
  const hasEssay = watch("hasEssay");

  // Mutations
  const { mutate: createAssignment } = useMutation({
    mutationFn: async (data: AssignmentFormValues) => {
      const res = await client.assignments.create.$post(data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      closeModal();
    },
  });

  const { mutate: updateAssignment } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: AssignmentFormValues;
    }) => {
      const res = await client.assignments.update.$post({
        assignmentId: id,
        updateAssignment: data,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      closeModal();
    },
  });

  const addEssayQuestion = () => {
    const currentQuestions = watch("essayQuestions") || [];
    setValue("essayQuestions", [
      ...currentQuestions,
      { questionText: "", maxWords: 500 },
    ]);
  };

  const removeEssayQuestion = (index: number) => {
    const currentQuestions = watch("essayQuestions") || [];
    setValue(
      "essayQuestions",
      currentQuestions.filter((_, i) => i !== index)
    );
  };

  const onSubmit = (data: AssignmentFormValues) => {
    if (editId) {
      updateAssignment({ id: editId, data });
    } else {
      createAssignment(data);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <ModalDialog
        aria-labelledby="assignment-modal-title"
        size="lg"
        sx={{ width: 800, maxWidth: "100%" }}
      >
        <ModalClose />
        <Typography id="assignment-modal-title" level="h4" component="h2">
          {editId ? t("modal.editTitle") : t("modal.createTitle")}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic">
            <TabList>
              <Tab value="basic">{t("modal.tabs.basicInfo")}</Tab>
              <Tab value="quiz" disabled={!hasQuiz}>
                {t("modal.tabs.quizSettings")}
              </Tab>
              <Tab value="essay" disabled={!hasEssay}>
                {t("modal.tabs.essayQuestions")}
              </Tab>
            </TabList>

            <TabPanel value="basic">
              <Stack spacing={2} sx={{ mt: 2 }}>
                <FormControl error={!!errors.title}>
                  <FormLabel>{t("modal.form.title")}</FormLabel>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder={t("modal.form.titlePlaceholder")}
                        {...field}
                      />
                    )}
                  />
                  {errors.title && (
                    <Typography level="body-xs" color="danger">
                      {errors.title.message}
                    </Typography>
                  )}
                </FormControl>

                <FormControl error={!!errors.description}>
                  <FormLabel>{t("modal.form.description")}</FormLabel>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        minRows={3}
                        placeholder={t("modal.form.descriptionPlaceholder")}
                        {...field}
                      />
                    )}
                  />
                  {errors.description && (
                    <Typography level="body-xs" color="danger">
                      {errors.description.message}
                    </Typography>
                  )}
                </FormControl>

                <FormControl error={!!errors.classId}>
                  <FormLabel>{t("modal.form.class")}</FormLabel>
                  <Controller
                    name="classId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder={t("modal.form.selectClass")}
                        {...field}
                        onChange={(_, value) => field.onChange(value)}
                      >
                        {classes?.map((classItem: Class) => (
                          <Option key={classItem.id} value={classItem.id}>
                            {classItem.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.classId && (
                    <Typography level="body-xs" color="danger">
                      {errors.classId.message}
                    </Typography>
                  )}
                </FormControl>

                <FormControl error={!!errors.dueDate}>
                  <FormLabel>{t("modal.form.dueDate")}</FormLabel>
                  <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        customInput={
                          <Input
                            startDecorator={<DateRangeRounded />}
                            sx={{ width: "100%" }}
                          />
                        }
                      />
                    )}
                  />
                  {errors.dueDate && (
                    <Typography level="body-xs" color="danger">
                      {errors.dueDate.message}
                    </Typography>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>{t("modal.form.calendarEvent")}</FormLabel>
                  <Controller
                    name="calendarId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder={t("modal.form.calendarEventPlaceholder")}
                        {...field}
                        onChange={(_, value) => field.onChange(value)}
                        startDecorator={<CalendarMonthRounded />}
                      >
                        {calendars?.map((calendar: Calendar) => (
                          <Option key={calendar.id} value={calendar.id}>
                            {calendar.title} (
                            {dayjs(calendar.date).format("DD MMM YYYY")})
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <FormControl>
                    <Controller
                      name="hasQuiz"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          label={t("modal.form.includeQuiz")}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>

                  <FormControl>
                    <Controller
                      name="hasEssay"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          label={t("modal.form.includeEssay")}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </FormControl>
                </Box>
              </Stack>
            </TabPanel>

            <TabPanel value="quiz">
              <Stack spacing={2} sx={{ mt: 2 }}>
                <FormControl>
                  <FormLabel>{t("modal.form.quizTitle")}</FormLabel>
                  <Controller
                    name="quizTitle"
                    control={control}
                    render={({ field }) => (
                      <Input
                        startDecorator={<QuizRounded />}
                        placeholder={t("modal.form.quizTitlePlaceholder")}
                        {...field}
                      />
                    )}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t("modal.form.quizDescription")}</FormLabel>
                  <Controller
                    name="quizDescription"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        minRows={2}
                        placeholder={t("modal.form.quizDescriptionPlaceholder")}
                        {...field}
                      />
                    )}
                  />
                </FormControl>

                <Typography level="body-sm" color="primary">
                  {t("modal.form.quizNote")}
                </Typography>
              </Stack>
            </TabPanel>

            <TabPanel value="essay">
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography level="title-md">
                    {t("modal.form.essayQuestionsTitle")}
                  </Typography>
                  <Button
                    size="sm"
                    startDecorator={<AddRounded />}
                    onClick={addEssayQuestion}
                  >
                    {t("modal.form.addQuestion")}
                  </Button>
                </Box>

                <Stack spacing={3}>
                  {watch("essayQuestions")?.map((_, index) => (
                    <Card key={index} variant="outlined">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography level="title-sm">
                          {t("modal.form.questionLabel", { number: index + 1 })}
                        </Typography>
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="danger"
                          onClick={() => removeEssayQuestion(index)}
                        >
                          <DeleteRounded />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid xs={12}>
                          <FormControl>
                            <FormLabel>
                              {t("modal.form.questionText")}
                            </FormLabel>
                            <Controller
                              name={`essayQuestions.${index}.questionText`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <Textarea
                                  minRows={2}
                                  placeholder={t(
                                    "modal.form.questionTextPlaceholder"
                                  )}
                                  {...field}
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <FormControl>
                            <FormLabel>{t("modal.form.maxWords")}</FormLabel>
                            <Controller
                              name={`essayQuestions.${index}.maxWords`}
                              control={control}
                              defaultValue={500}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  placeholder={t(
                                    "modal.form.maxWordsPlaceholder"
                                  )}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined
                                    )
                                  }
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}

                  {(!watch("essayQuestions") ||
                    watch("essayQuestions")?.length === 0) && (
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 3,
                        border: "1px dashed",
                        borderColor: "neutral.outlinedBorder",
                        borderRadius: "md",
                      }}
                    >
                      <Typography level="body-sm">
                        {t("modal.form.noEssayQuestions")}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </TabPanel>
          </Tabs>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
              mt: 4,
            }}
          >
            <Button variant="plain" color="neutral" onClick={closeModal}>
              {t("modal.form.cancel")}
            </Button>
            <Button type="submit">
              {editId ? t("modal.form.update") : t("modal.form.create")}
            </Button>
          </Box>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default DialogAddAssignment;
