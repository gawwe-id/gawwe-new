"use client";

import { client } from "@/lib/client";
import { AddRounded, FactCheckRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import FilterExam from "./FilterExam";
import TableExams from "./TableExams";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useExamStore } from "@/store/examStore";
import CreateExamDialog from "./CreateExamDialog";
import EditExamDialog from "./EditExamDialog";

const examSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  examDate: z.date(),
  startTime: z.date(),
  endTime: z.date(),
  classId: z.string(),
  calendarId: z.string().uuid().optional(),
  status: z.string().default("draft"),
  isPublished: z.boolean().default(false),
  isOnline: z.boolean().default(false),
  link: z.string().url().optional(),
});

export type ExamFormValues = z.infer<typeof examSchema>;

const ExamContent = () => {
  const { t } = useTranslation("assignment");
  const { openModal, setEditId } = useExamStore();

  // Form Setup
  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "draft",
      isPublished: false,
      isOnline: false,
      link: "",
    },
  });

  // Queries
  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const res = await client.exams.list.$get();
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

  const handleCreate = () => {
    setEditId(null);
    openModal();

    form.reset({
      title: "",
      description: "",
      status: "draft",
      isPublished: false,
      isOnline: false,
      link: "",
    });
  };

  // Loading state
  if (isLoadingExams || isLoadingClasses) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography level="h4">{t("exam.page.loading")}</Typography>
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
        <Typography level="h3" startDecorator={<FactCheckRounded />}>
          {t("exam.page.title")}
        </Typography>
        <Button
          startDecorator={<AddRounded />}
          onClick={handleCreate}
          color="primary"
        >
          {t("exam.actions.create")}
        </Button>
      </Box>

      {/* Filter Component */}
      <FilterExam classes={classes?.data} />

      {/* Table Component */}
      <TableExams
        exams={exams?.data || []}
        classes={classes?.data}
        isLoading={isLoadingExams || isLoadingClasses}
      />

      {/* Create Exam Dialog */}
      <CreateExamDialog form={form} classes={classes?.data} />

      {/* Edit xam Dialog */}
      <EditExamDialog classes={classes?.data} />
    </>
  );
};

export default ExamContent;
