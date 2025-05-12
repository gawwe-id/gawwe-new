"use client";

import { Box, Button, Typography } from "@mui/joy";
import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskStore } from "@/store/taskStore";
import { z } from "zod";
import TableTask from "./TableTask";
import FilterTask from "./FilterTask";
import DialogAddTask from "./DialogAddTask";

// assets
import {
  AddRounded as AddIcon,
  AssignmentRounded as AssignmentIcon,
} from "@mui/icons-material";
import "react-datepicker/dist/react-datepicker.css";

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

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;

const TaskContent = () => {
  const { t } = useTranslation("assignment");
  const { openModal, setEditId } = useTaskStore();

  // Form setup
  const form = useForm<AssignmentFormValues>({
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

  // Queries
  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const res = await client.assignments.list.$get();
      return res.json();
    },
  });

  const { data: classes, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await client.classes.list.$get();
      return res.json();
    },
  });

  const { data: calendars, isLoading: isLoadingCalendars } = useQuery({
    queryKey: ["calendars"],
    queryFn: async () => {
      const res = await client.calendars.list.$get();
      return res.json();
    },
  });

  const handleCreate = () => {
    setEditId(null);
    openModal();

    form.reset({
      title: "",
      description: "",
      dueDate: new Date(),
      calendarId: null,
      hasQuiz: false,
      hasEssay: false,
      essayQuestions: [],
    });
  };

  // Loading state
  if (isLoadingAssignments || isLoadingClasses || isLoadingCalendars) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography level="h4">{t("task.page.loading")}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 3,
        }}
      >
        <Typography level="h3" startDecorator={<AssignmentIcon />}>
          {t("task.page.title")}
        </Typography>
        <Button
          startDecorator={<AddIcon />}
          onClick={handleCreate}
          color="primary"
        >
          {t("task.page.addButton")}
        </Button>
      </Box>

      <FilterTask classes={classes?.data} />
      <TableTask
        form={form}
        assignments={assignments?.data}
        classes={classes?.data}
      />
      <DialogAddTask
        form={form}
        classes={classes?.data}
        calendars={calendars?.data}
      />
    </>
  );
};

export default TaskContent;
