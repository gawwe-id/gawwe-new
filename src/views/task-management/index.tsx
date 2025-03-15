"use client";

import * as React from "react";
import { Typography, Button, Box } from "@mui/joy";
import {
  AddRounded as AddIcon,
  AssignmentRounded as AssignmentIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
import "react-datepicker/dist/react-datepicker.css";
import { useTaskManagementStore } from "@/store/taskManagementStore";
import DialogAddAssignment from "./_components/DialogAddAssignment";
import FilterAssginment from "./_components/FilterAssginment";
import TableAssignment from "./_components/TableAssignment";
import { useTranslation } from "react-i18next";

// Types from schema

export default function TaskManagement() {
  const { t } = useTranslation("assignment");
  const { openModal, setEditId } = useTaskManagementStore();

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
  };

  // Loading state
  if (isLoadingAssignments || isLoadingClasses || isLoadingCalendars) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography level="h4">{t("page.loading")}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography level="h3" startDecorator={<AssignmentIcon />}>
          {t("page.title")}
        </Typography>
        <Button
          startDecorator={<AddIcon />}
          onClick={handleCreate}
          color="primary"
        >
          {t("page.addButton")}
        </Button>
      </Box>

      <FilterAssginment classes={classes?.data} />
      <TableAssignment
        assignments={assignments?.data}
        classes={classes?.data}
      />
      <DialogAddAssignment
        classes={classes?.data}
        calendars={calendars?.data}
      />
    </Box>
  );
}
