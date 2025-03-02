"use client";

import { useState } from "react";
import { useClass } from "@/hooks/useClass";
import {
  ArrowBackRounded,
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
import { useParams } from "next/navigation";
import EditClassDialog from "./EditClassDialog";
import { useEditClassStore } from "@/store/useEditClassStore";

const ClassDetail = () => {
  const params = useParams();
  const classId = params.classId as string;
  const { data: classData, isLoading } = useClass(classId);
  const open = useEditClassStore((state) => state.isOpen);
  const onClose = useEditClassStore((state) => state.closeDialog);
  const onOpenEdit = useEditClassStore((state) => state.openDialog);

  const [showScheduleManager, setShowScheduleManager] = useState(false);

  const cls = classData?.data;

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("D MMMM YYYY");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      {/* Header with back button */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: "center" }}>
        <IconButton
          //   onClick={handleBackClick}
          variant="outlined"
        >
          <ArrowBackRounded />
        </IconButton>
        <Typography level="h3">Class Detail</Typography>
      </Stack>

      {/* Class Information Card */}
      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SchoolRounded sx={{ mr: 1, fontSize: 24 }} />
            <Typography level="title-lg">Class Information</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              size="sm"
              variant="outlined"
              color="primary"
              startDecorator={<EditRounded />}
              onClick={() => onOpenEdit({ class: cls })}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="outlined"
              color="danger"
              startDecorator={<DeleteRounded />}
              //   onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              startDecorator={<EventRounded />}
              //   onClick={() => setShowScheduleManager(true)}
            >
              Manage Schedule
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

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

      {/* Schedule management section - shown directly on the page */}
      {!showScheduleManager && (
        <Card>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventRounded sx={{ mr: 1 }} />
              <Typography level="title-lg">Class Schedules</Typography>
            </Box>
            <Button
              size="sm"
              variant="solid"
              color="primary"
              onClick={() => setShowScheduleManager(true)}
            >
              Manage Schedules
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Basic schedule display - you can enhance this with your ClassScheduleManager in read-only mode */}
          {/* <ClassScheduleManager
            classId={classId}
            data={cls}
            readOnly={true}
          /> */}
        </Card>
      )}

      {/* Schedule management full display - shown when user clicks on Manage Schedule */}
      {showScheduleManager && (
        <Card>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventRounded sx={{ mr: 1 }} />
              <Typography level="title-lg">Manage Class Schedules</Typography>
            </Box>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setShowScheduleManager(false)}
            >
              Done
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Full schedule manager */}
          {/* <ClassScheduleManager
            classId={classId}
            data={cls}
            readOnly={false}
            onBack={() => setShowScheduleManager(false)}
          /> */}
        </Card>
      )}

      <EditClassDialog open={open} onClose={onClose} />
    </Box>
  );
};

export default ClassDetail;
