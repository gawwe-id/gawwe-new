"use client";

import { useUpdateClass } from "@/hooks/useClass";
import { useSnackbar } from "@/hooks/useSnackbar";
import { Class } from "@/server/db/schema/classes";
import { useEditClassStore } from "@/store/useEditClassStore";
import { CalendarMonthRounded } from "@mui/icons-material";
import {
  Button,
  DialogContent,
  DialogTitle,
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
} from "@mui/joy";
import dayjs from "dayjs";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface EditClassDialogProps {
  open: boolean;
  onClose: () => void;
}

const EditClassDialog = ({ open, onClose }: EditClassDialogProps) => {
  const { t } = useTranslation("class");
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
      showSnackbar(t("notifications.classUpdated"), "success");
    },
    (error) => {
      closeDialog();
      showSnackbar(
        t("notifications.error", { message: error.message }),
        "danger"
      );
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
      <ModalDialog variant="outlined">
        <DialogTitle>
          {t("common.actions.edit")}{" "}
          {t("classSetting.classesSection.title", { language: "" }).trim()}
        </DialogTitle>
        <DialogContent>{t("classDetail.sections.information")}</DialogContent>

        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid xs={12} md={10}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t("createClass.form.errors.nameRequired") }}
                render={({ field, fieldState }) => (
                  <FormControl error={!!fieldState.error}>
                    <FormLabel>{t("createClass.form.className")}</FormLabel>
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

            <Grid xs={12} md={2}>
              <Controller
                name="batch"
                control={control}
                rules={{
                  required: t("createClass.form.errors.batchRequired"),
                  min: {
                    value: 1,
                    message: t("createClass.form.errors.batchMin"),
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormControl error={!!fieldState.error}>
                    <FormLabel>{t("createClass.form.batch")}</FormLabel>
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
                rules={{
                  required: t("createClass.form.errors.descriptionRequired"),
                }}
                render={({ field, fieldState }) => (
                  <FormControl error={!!fieldState.error}>
                    <FormLabel>{t("createClass.form.description")}</FormLabel>
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
                <FormLabel>{t("createClass.form.startDate")}</FormLabel>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{
                    required: t("createClass.form.errors.startDateRequired"),
                  }}
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
                <FormLabel>{t("createClass.form.endDate")}</FormLabel>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{
                    required: t("createClass.form.errors.endDateRequired"),
                    validate: (value) =>
                      value > startDate ||
                      t("createClass.form.errors.endDateAfterStart"),
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
              {t("common.actions.cancel")}
            </Button>
            <Button
              size="sm"
              type="submit"
              loading={isPending}
              disabled={!isValid || isPending}
            >
              {t("common.actions.saveChanges")}
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default EditClassDialog;
