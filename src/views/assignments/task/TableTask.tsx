"use client";

import { client } from "@/lib/client";
import { useTaskStore } from "@/store/taskStore";
import {
  DeleteRounded,
  EditRounded,
  ListAltRounded,
  MoreVertRounded,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDialogAlertStore } from "@/store/useDialogAlertStore";
import { AssignmentFormValues } from ".";

type Assignment = {
  id: string;
  calendarId: string | null;
  classId: string | null;
  title: string;
  description: string;
  dueDate: Date;
  hasQuiz: boolean;
  hasEssay: boolean;
};

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

interface TableTaskProps {
  assignments: Assignment[] | undefined;
  classes: Class[] | undefined;
  form: UseFormReturn<AssignmentFormValues>;
}

const TableTask = ({ assignments, classes, form }: TableTaskProps) => {
  const { t } = useTranslation("assignment");
  const queryClient = useQueryClient();

  const { searchTerm, selectedClass, dateRange, setEditId } = useTaskStore();
  const { openDialog, setLoading, closeDialog } = useDialogAlertStore();

  const { mutate: deleteAssignment } = useMutation({
    mutationFn: async (id: string) => {
      setLoading(true);
      const res = await client.assignments.delete.$post({
        assignmentId: id,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      setLoading(false);
      closeDialog();
    },
  });

  const filteredAssignments = useMemo(() => {
    if (!assignments) return [];

    return assignments?.filter((assignment: Assignment) => {
      const matchesSearch = assignment.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesClass =
        !selectedClass || assignment.classId === selectedClass;

      const matchesDateRange =
        !dateRange.start ||
        !dateRange.end ||
        (new Date(assignment.dueDate) >= dateRange.start &&
          new Date(assignment.dueDate) <= dateRange.end);

      return matchesSearch && matchesClass && matchesDateRange;
    });
  }, [assignments, searchTerm, selectedClass, dateRange]);

  const handleEdit = (assignment: Assignment) => {
    setEditId(assignment.id);

    form.reset({
      title: assignment.title,
      description: assignment.description,
      classId: assignment?.classId as string,
      dueDate: new Date(assignment.dueDate),
      calendarId: assignment.calendarId,
      hasQuiz: assignment.hasQuiz,
      hasEssay: assignment.hasEssay,
    });
  };

  const handleDelete = (id: string) => {
    openDialog({
      title: t("task.modal.deleteTitle"),
      description: t("task.modal.descriptionDelete"),
      textCancel: t("task.modal.form.cancel"),
      textAction: t("task.modal.form.delete"),
      onAction: () => deleteAssignment(id),
    });
  };

  // Get class name by ID
  const getClassName = (classId: string) => {
    const classItem = classes?.find((c: Class) => c.id === classId);
    return classItem ? classItem.name : t("task.table.unknownClass");
  };

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
        stripe="odd"
        hoverRow
        sx={{
          "--TableCell-headBackground": "transparent",
          "--Table-headerUnderlineThickness": "1px",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "40%" }}>{t("task.table.title")}</th>
            <th>{t("task.table.class")}</th>
            <th>{t("task.table.dueDate")}</th>
            <th style={{ width: "15%" }}>{t("task.table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment: Assignment, index: number) => (
              <tr key={index}>
                <td>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <ListAltRounded />
                    <Box>
                      <Typography fontWeight="md">
                        {assignment.title}
                      </Typography>
                      <Typography level="body-xs">
                        {assignment.description.substring(0, 100)}
                        {assignment.description.length > 100 ? "..." : ""}
                      </Typography>
                    </Box>
                  </Box>
                </td>
                <td>{getClassName(assignment?.classId ?? "")}</td>
                <td>
                  <Chip color="neutral" variant="soft">
                    {dayjs(assignment.dueDate).format("DD MMM YYYY")}
                  </Chip>
                </td>
                <td>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      onClick={() => handleEdit(assignment)}
                    >
                      <EditRounded />
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant="soft"
                      color="danger"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      <DeleteRounded />
                    </IconButton>
                    <Dropdown>
                      <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{
                          root: {
                            variant: "plain",
                            color: "neutral",
                            size: "sm",
                          },
                        }}
                      >
                        <MoreVertRounded />
                      </MenuButton>
                      <Menu placement="bottom-end">
                        <MenuItem>{t("task.table.viewSubmissions")}</MenuItem>
                        <MenuItem>{t("task.table.generateReport")}</MenuItem>
                        <MenuItem>{t("task.table.sendNotification")}</MenuItem>
                      </Menu>
                    </Dropdown>
                  </Box>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                <Box sx={{ py: 3 }}>
                  <Typography level="body-lg">
                    {t("task.table.noAssignmentsFound")}
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

export default TableTask;
