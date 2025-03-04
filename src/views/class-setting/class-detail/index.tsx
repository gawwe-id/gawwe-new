"use client";

import { useState } from "react";
import { useClass, useDeleteClass } from "@/hooks/useClass";
import {
  ArrowBackRounded,
  CheckRounded,
  DeleteRounded,
  EditRounded,
  EventRounded,
  SchoolRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import EditClassDialog from "./EditClassDialog";
import { useEditClassStore } from "@/store/useEditClassStore";
import { useDialogAlertStore } from "@/store/useDialogAlertStore";
import { useSnackbar } from "@/hooks/useSnackbar";
import FormSchedule from "./FormSchedule";
import ListSchedule from "./ListSchedule";
import CalendarSchedule from "./CalendarSchedule";

const ClassDetail = () => {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;
  const { showSnackbar } = useSnackbar();

  const open = useEditClassStore((state) => state.isOpen);
  const onClose = useEditClassStore((state) => state.closeDialog);
  const onOpenEdit = useEditClassStore((state) => state.openDialog);
  const { openDialog, setLoading } = useDialogAlertStore();

  const [showScheduleManager, setShowScheduleManager] = useState(false);

  const { data: classData, isLoading } = useClass(classId);

  const { mutate: mutateDelete } = useDeleteClass(
    () => {
      setLoading(false);
      showSnackbar("Berhasil mengapus Kelas", "success");
      router.back();
    },
    (error) => {
      showSnackbar(error.message, "danger");
    }
  );

  const cls = classData?.data;

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("D MMMM YYYY");
  };

  const handleDeleteClass = async () => {
    setLoading(true);
    mutateDelete({ classId });
  };

  const openDialogDelete = () => {
    openDialog({
      title: "Hapus Kelas",
      description: "Apakah Kamu yakin ingin menghapus Kelas ini?",
      textCancel: "Batal",
      textAction: "Hapus",
      onAction: handleDeleteClass,
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
        <IconButton onClick={() => router.back()} variant="plain">
          <ArrowBackRounded />
        </IconButton>
        <Typography level="h3">Class Detail</Typography>
      </Stack>

      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SchoolRounded sx={{ mr: 1, fontSize: 24 }} />
            <Typography level="title-lg">Class Information</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              size="sm"
              variant="soft"
              color="secondary"
              startDecorator={<EditRounded />}
              onClick={() => onOpenEdit({ class: cls })}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="soft"
              color="danger"
              startDecorator={<DeleteRounded />}
              onClick={openDialogDelete}
            >
              Hapus
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <Sheet variant="outlined" sx={{ p: 2, borderRadius: "sm" }}>
              <Typography level="title-sm" sx={{ mb: 1 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid xs={12} md={4}>
                  <Typography level="body-sm" fontWeight="bold">
                    Name:
                  </Typography>
                </Grid>
                <Grid xs={12} md={8}>
                  <Typography level="body-sm">{cls?.name}</Typography>
                </Grid>

                <Grid xs={12} md={4}>
                  <Typography level="body-sm" fontWeight="bold">
                    Batch:
                  </Typography>
                </Grid>
                <Grid xs={12} md={8}>
                  <Typography level="body-sm">{cls?.batch}</Typography>
                </Grid>

                <Grid xs={12} md={4}>
                  <Typography level="body-sm" fontWeight="bold">
                    Description:
                  </Typography>
                </Grid>
                <Grid xs={12} md={8}>
                  <Typography level="body-sm">{cls?.description}</Typography>
                </Grid>
              </Grid>
            </Sheet>
          </Grid>

          <Grid xs={12} md={6}>
            <Sheet variant="outlined" sx={{ p: 2, borderRadius: "sm" }}>
              <Typography level="title-sm" sx={{ mb: 1 }}>
                Schedule Information
              </Typography>
              <Grid container spacing={2}>
                <Grid xs={12} md={4}>
                  <Typography level="body-sm" fontWeight="bold">
                    Start Date:
                  </Typography>
                </Grid>
                <Grid xs={12} md={8}>
                  <Typography level="body-sm">
                    {formatDate(cls?.startDate)}
                  </Typography>
                </Grid>

                <Grid xs={12} md={4}>
                  <Typography level="body-sm" fontWeight="bold">
                    End Date:
                  </Typography>
                </Grid>
                <Grid xs={12} md={8}>
                  <Typography level="body-sm">
                    {formatDate(cls?.endDate)}
                  </Typography>
                </Grid>

                <Grid xs={12} md={4}>
                  <Typography level="body-sm" fontWeight="bold">
                    Created At:
                  </Typography>
                </Grid>
                <Grid xs={12} md={8}>
                  <Typography level="body-sm">
                    {formatDate(cls?.createdAt)}
                  </Typography>
                </Grid>

                <Grid xs={12} md={4}>
                  <Typography level="body-sm" fontWeight="bold">
                    Updated At:
                  </Typography>
                </Grid>
                <Grid xs={12} md={8}>
                  <Typography level="body-sm">
                    {formatDate(cls?.updatedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </Sheet>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={2}>
        <Grid xs={12} sm={2} md={4}>
          <FormSchedule classId={classId} />
        </Grid>
        <Grid xs={12} sm={2} md={4}>
          <CalendarSchedule classData={classData?.data} />
        </Grid>
        <Grid xs={12} sm={2} md={4}></Grid>
      </Grid>

      <EditClassDialog open={open} onClose={onClose} />
    </Box>
  );
};

export default ClassDetail;
