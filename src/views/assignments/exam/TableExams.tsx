import { Box, Chip, IconButton, Sheet, Table, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  DeleteRounded,
  EditRounded,
  ListAltRounded,
} from "@mui/icons-material";
import { useMemo } from "react";
import { Exam } from "@/server/db/schema/exams";
import { useExamStore } from "@/store/examStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useDialogAlertStore } from "@/store/useDialogAlertStore";

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

const statusColorMap: Record<string, any> = {
  draft: "neutral",
  published: "primary",
  ongoing: "info",
  completed: "success",
  cancelled: "danger",
};

interface TableExamsProps {
  exams: any[];
  classes: Class[] | undefined;
  isLoading: boolean;
}

const TableExams = ({ exams, classes }: TableExamsProps) => {
  const { t } = useTranslation("assignment");
  const queryClient = useQueryClient();

  const { searchTerm, selectedClass, dateRange, status, setEditId, openEdit } =
    useExamStore();
  const { openDialog, setLoading, closeDialog } = useDialogAlertStore();

  // Delete Exam
  const { mutate: deleteExam } = useMutation({
    mutationFn: async (id: string) => {
      setLoading(true);
      const res = await client.exams.delete.$post({
        examId: id,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      setLoading(false);
      closeDialog();
    },
  });

  // Get class name by ID
  const getClassName = (classId: string) => {
    const classItem = classes?.find((c: Class) => c.id === classId);
    return classItem ? classItem.name : t("table.unknownClass");
  };

  const handleEditExam = (examId: string) => {
    openEdit();
    setEditId(examId);
  };

  const handleDeleteExam = (examId: string) => {
    openDialog({
      title: t("exam.modal.deleteTitle"),
      description: t("exam.modal.descriptionDelete"),
      textCancel: t("exam.form.cancel"),
      textAction: t("exam.form.delete"),
      onAction: () => deleteExam(examId),
    });
  };

  const filteredExams = useMemo(() => {
    if (!exams) return [];

    return exams?.filter((exam: Exam) => {
      const matchesSearch = exam.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus = !status || exam.status === status;

      const matchesClass = !selectedClass || exam.classId === selectedClass;

      const matchesDateRange =
        !dateRange.start ||
        !dateRange.end ||
        (exam?.examDate &&
          new Date(exam.examDate) >= dateRange.start &&
          exam?.examDate &&
          new Date(exam.examDate) <= dateRange.end);

      return matchesSearch && matchesStatus && matchesClass && matchesDateRange;
    });
  }, [exams, searchTerm, selectedClass, dateRange, status]);

  return (
    <Sheet
      variant="outlined"
      sx={{
        borderRadius: "md",
        overflow: "auto",
        width: "100%",
        minHeight: 400,
      }}
    >
      <Table
        hoverRow
        variant="soft"
        color="neutral"
        sx={{
          "--Table-headerUnderlineThickness": "2px",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "35%" }}>{t("exam.table.title")}</th>
            <th>{t("exam.table.class")}</th>
            <th>{t("exam.table.examDate")}</th>
            <th>{t("exam.table.examTime")}</th>
            <th>{t("exam.table.status")}</th>
            <th style={{ width: "10%" }}>{t("exam.table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <tr key={exam.id}>
                <td>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <ListAltRounded />
                    <Box>
                      <Typography fontWeight="md">{exam.title}</Typography>
                      <Typography level="body-xs">
                        {exam.description.substring(0, 100)}
                        {exam.description.length > 100 ? "..." : ""}
                      </Typography>
                    </Box>
                  </Box>
                </td>
                <td>{getClassName(exam?.classId ?? "")}</td>
                <td>
                  <Chip color="neutral" variant="soft">
                    {dayjs(exam.examDate).format("DD MMM YYYY")}
                  </Chip>
                </td>
                <td>
                  <Chip color="neutral" variant="soft">
                    {dayjs(exam.startTime).format("HH:mm")}-
                    {dayjs(exam.endTime).format("HH:mm")}
                  </Chip>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    color={statusColorMap[exam.status] || "neutral"}
                    size="sm"
                  >
                    {t(`exam.status.${exam.status}`)}
                  </Chip>
                </td>
                <td>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="sm"
                      variant="soft"
                      color="neutral"
                      onClick={() => handleEditExam(exam.id)}
                    >
                      <EditRounded />
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant="soft"
                      color="danger"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      <DeleteRounded />
                    </IconButton>
                  </Box>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                <Box sx={{ py: 3 }}>
                  <Typography level="body-lg">
                    {t("exam.table.noExamsFound")}
                  </Typography>
                </Box>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default TableExams;
