"use client";

import { client } from "@/lib/client";
import { useTaskManagementStore } from "@/store/taskManagementStore";
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
import { useTranslation } from "react-i18next";

type Assignment = {
  id: string;
  calendarId: string | null;
  classId: string | null;
  title: string;
  description: string;
  dueDate: Date;
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

interface TableAssignmentProps {
  assignments: Assignment[] | undefined;
  classes: Class[] | undefined;
}

const TableAssignment = ({ assignments, classes }: TableAssignmentProps) => {
  const { t } = useTranslation("assignment");
  const queryClient = useQueryClient();

  const { searchTerm, selectedClass, dateRange, setEditId } =
    useTaskManagementStore();

  const { mutate: deleteAssignment } = useMutation({
    mutationFn: async (id: string) => {
      const res = await client.assignments.delete.$post({
        assignmentId: id,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
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
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t("table.deleteConfirmation"))) {
      deleteAssignment(id);
    }
  };

  // Get class name by ID
  const getClassName = (classId: string) => {
    const classItem = classes?.find((c: Class) => c.id === classId);
    return classItem ? classItem.name : t("table.unknownClass");
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
            <th style={{ width: "40%" }}>{t("table.title")}</th>
            <th>{t("table.class")}</th>
            <th>{t("table.dueDate")}</th>
            <th style={{ width: "15%" }}>{t("table.actions")}</th>
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
                      <Typography level="body-sm">
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
                        <MenuItem>{t("table.viewSubmissions")}</MenuItem>
                        <MenuItem>{t("table.generateReport")}</MenuItem>
                        <MenuItem>{t("table.sendNotification")}</MenuItem>
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
                    {t("table.noAssignmentsFound")}
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

export default TableAssignment;
