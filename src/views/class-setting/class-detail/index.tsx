"use client";

import { useClass, useDeleteClass } from "@/hooks/useClass";
import {
  ArrowBackRounded,
  DeleteRounded,
  EditRounded,
  SchoolRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
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
import CalendarSchedule from "./CalendarSchedule";
import ClassParticipants from "./ClassParticipants";

const ClassDetail = () => {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;
  const { showSnackbar } = useSnackbar();

  const open = useEditClassStore((state) => state.isOpen);
  const onClose = useEditClassStore((state) => state.closeDialog);
  const onOpenEdit = useEditClassStore((state) => state.openDialog);
  const { openDialog, setLoading } = useDialogAlertStore();

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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress size="sm" />
      </Box>
    );
  }

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

        <Sheet variant="outlined" sx={{ p: 2, borderRadius: "sm" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Typography level="body-md" fontWeight="bold">
              {cls?.name}
            </Typography>
            <Chip size="sm" variant="soft" color="primary">
              Batch: {cls?.batch}
            </Chip>
          </Stack>
        </Sheet>

        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <Sheet variant="outlined" sx={{ p: 2, borderRadius: "sm" }}>
              <Typography level="title-sm" sx={{ mb: 1 }}>
                Description
              </Typography>
              <Typography level="body-sm">{cls?.description}</Typography>
            </Sheet>
          </Grid>

          <Grid xs={12} md={6}>
            <Sheet variant="outlined" sx={{ p: 2, borderRadius: "sm" }}>
              <Typography level="title-sm" sx={{ mb: 1 }}>
                Schedule Information
              </Typography>
              <Grid container spacing={0.3}>
                <Grid xs={12} md={4}>
                  <Typography level="body-xs" fontWeight="bold">
                    Start Date:
                  </Typography>
                </Grid>
                <Grid xs={12} md={8}>
                  <Typography level="body-xs">
                    {formatDate(cls?.startDate)}
                  </Typography>
                </Grid>

                <Grid xs={12} md={4}>
                  <Typography level="body-xs" fontWeight="bold">
                    End Date:
                  </Typography>
                </Grid>
                <Grid xs={12} md={8}>
                  <Typography level="body-xs">
                    {formatDate(cls?.endDate)}
                  </Typography>
                </Grid>
              </Grid>
            </Sheet>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={4}>
          <FormSchedule classId={classId} />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <CalendarSchedule classData={classData?.data} />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <ClassParticipants classId={classId} />
        </Grid>
      </Grid>

      <EditClassDialog open={open} onClose={onClose} />
    </Box>
  );
};

export default ClassDetail;
