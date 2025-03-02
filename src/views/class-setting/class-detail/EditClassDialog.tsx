"use client";

import { useUpdateClass } from "@/hooks/useClass";
import { useSnackbar } from "@/hooks/useSnackbar";
import { Class } from "@/server/db/schema/classes";
import { useEditClassStore } from "@/store/useEditClassStore";
import { CalendarMonthRounded, SchoolRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalDialog,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import dayjs from "dayjs";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";

interface EditClassDialogProps {
  open: boolean;
  onClose: () => void;
}

const EditClassDialog = ({ open, onClose }: EditClassDialogProps) => {
  const classData = useEditClassStore((state) => state.classConfig?.class);
  const closeDialog = useEditClassStore((state) => state.closeDialog);
  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<Class>({
    defaultValues: {
      name: classData?.name,
      description: classData?.description,
      batch: classData?.batch,
      startDate: classData?.startDate
        ? dayjs(classData.startDate).toDate()
        : undefined,
      endDate: classData?.endDate
        ? dayjs(classData.endDate).toDate()
        : undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (classData) {
      reset({
        name: classData.name,
        description: classData.description,
        batch: classData.batch,
        startDate: classData.startDate,
        endDate: classData.endDate,
      });
    }
  }, [classData]);

  const startDate = watch("startDate");

  const { mutate: updateClass, isPending } = useUpdateClass(
    () => {
      closeDialog();
      showSnackbar("Berhasil menyimpan perubahan", "success");
    },
    (error) => {
      closeDialog();
      showSnackbar(error.message, "danger");
    }
  );

  const onSubmit = (data: Class) => {
    if (classData) {
      updateClass({
        classId: classData?.id,
        languageClassId: classData?.languageClassId,
        updateClass: {
          ...data,
          startDate: dayjs(data.startDate).toDate(),
          endDate: dayjs(data.endDate).toDate(),
        },
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              width: 60,
              height: 60,
              bgcolor: "primary.softBg",
              color: "primary.500",
              mb: 1,
            }}
          >
            <SchoolRounded sx={{ fontSize: 30 }} />
          </Box>

          <Typography
            component="h2"
            id="add-language-modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
          >
            Tambah Bahasa Baru
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Class name is required" }}
                render={({ field, fieldState }) => (
                  <FormControl error={!!fieldState.error}>
                    <FormLabel>Nama Kelas</FormLabel>
                    <Input {...field} value={field.value} size="sm" />
                    {fieldState.error && (
                      <FormHelperText>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <Controller
                name="batch"
                control={control}
                rules={{
                  required: "Batch is required",
                  min: { value: 1, message: "Minimum batch is 1" },
                }}
                render={({ field, fieldState }) => (
                  <FormControl error={!!fieldState.error}>
                    <FormLabel>Batch</FormLabel>
                    <Input
                      {...field}
                      type="number"
                      size="sm"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || "")
                      }
                    />
                    {fieldState.error && (
                      <FormHelperText>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid xs={12}>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field, fieldState }) => (
                  <FormControl error={!!fieldState.error}>
                    <FormLabel>Deskripsi</FormLabel>
                    <Textarea {...field} minRows={3} />
                    {fieldState.error && (
                      <FormHelperText>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <FormControl error={!!errors.startDate} required>
                <FormLabel>Tanggal Mulai</FormLabel>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "Tanggal mulai harus diisi" }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      customInput={
                        <Input
                          size="sm"
                          fullWidth
                          endDecorator={<CalendarMonthRounded />}
                        />
                      }
                    />
                  )}
                />
              </FormControl>
              {errors.startDate && (
                <FormHelperText sx={{ color: "red", fontSize: 12, mt: 1 }}>
                  {errors.startDate.message}
                </FormHelperText>
              )}
            </Grid>

            <Grid xs={12} md={6}>
              <FormControl error={!!errors.endDate} required>
                <FormLabel>Tanggal Selesai</FormLabel>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: "Tanggal selesai harus diisi",
                    validate: (value) =>
                      value > startDate ||
                      "Tanggal selesai harus setelah tanggal mulai",
                  }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      minDate={startDate}
                      customInput={
                        <Input
                          size="sm"
                          fullWidth
                          endDecorator={<CalendarMonthRounded />}
                        />
                      }
                    />
                  )}
                />
              </FormControl>
              {errors.endDate && (
                <FormHelperText sx={{ color: "red", fontSize: 12, mt: 1 }}>
                  {errors.endDate.message}
                </FormHelperText>
              )}
            </Grid>
          </Grid>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, justifyContent: "flex-end" }}
          >
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={closeDialog}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              loading={isPending}
              disabled={!isValid || isPending}
            >
              Simpan Perubahan
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default EditClassDialog;
