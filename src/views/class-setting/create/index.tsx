"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

// UI Components
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Alert,
  IconButton,
  Stack,
  Chip,
  List,
  ListItem,
  FormHelperText,
} from "@mui/joy";

import {
  ArrowBackRounded as ArrowBackIcon,
  SaveRounded as SaveIcon,
  CalendarMonthRounded as CalendarIcon,
  LanguageRounded as LanguageIcon,
  InfoRounded as InfoIcon,
} from "@mui/icons-material";
import { customStyles } from "@/utils/dateSelection";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewClass } from "@/server/db/schema/classes";
import { client } from "@/lib/client";
import { useSnackbar } from "@/hooks/useSnackbar";
import ClassScheduleManager from "../sections/ClassScheduleManager";

export default function CreateClass() {
  const { t } = useTranslation("class");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const languageId = searchParams.get("languageId") as string;
  const { showSnackbar } = useSnackbar();

  const { data: languageData } = useQuery({
    queryKey: ["language-class", languageId],
    queryFn: async () => {
      const response = await client.languageClasses.single.$get({
        languageClassId: languageId,
      });
      return await response.json();
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<NewClass>({
    defaultValues: {
      name: "",
      description: "",
      languageClassId: languageId,
      batch: 1,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
  });

  const startDate = watch("startDate");

  const {
    mutate: mutateClass,
    data: classData,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: NewClass) => {
      const response = await client.classes.create.$post(data);
      return await response.json();
    },
    onSuccess: async ({ message, data }) => {
      await queryClient.invalidateQueries({
        queryKey: ["classes-by-language", data?.languageClassId],
      });
      showSnackbar(t("notifications.classCreated"), "success");
    },
    onError: (error) => {
      console.error("Error creating class:", error);
      showSnackbar(
        t("notifications.error", { message: error.message }),
        "danger"
      );
    },
  });

  const onSubmit = async (data: NewClass) => {
    mutateClass(data);
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 6 }, maxWidth: "1000px", mx: "auto" }}>
      <style>{customStyles}</style>
      {!isSuccess && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              component={Link}
              href="/class-setting"
              size="sm"
              variant="plain"
              color="neutral"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography level="h2">{t("createClass.pageTitle")}</Typography>
          </Box>
        </Box>
      )}

      {!isSuccess && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Left Column - Main Form */}
            <Grid xs={12} md={8}>
              <Card variant="outlined">
                <Typography level="title-lg" sx={{ mb: 2 }}>
                  {t("createClass.sections.classInfo")}
                </Typography>

                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <FormControl error={!!errors.name} required>
                      <FormLabel>{t("createClass.form.className")}</FormLabel>
                      <Input
                        size="sm"
                        fullWidth
                        placeholder={t("createClass.form.classNamePlaceholder")}
                        {...register("name", {
                          required: t("createClass.form.errors.nameRequired"),
                        })}
                      />
                    </FormControl>
                    {errors.name && (
                      <FormHelperText
                        sx={{ color: "red", fontSize: 12, mt: 1 }}
                      >
                        * {errors.name.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <FormControl error={!!errors.batch} required>
                      <FormLabel>{t("createClass.form.batch")}</FormLabel>
                      <Input
                        type="number"
                        placeholder="1"
                        size="sm"
                        slotProps={{ input: { min: 1 } }}
                        {...register("batch", {
                          required: t("createClass.form.errors.batchRequired"),
                          min: {
                            value: 1,
                            message: t("createClass.form.errors.batchMin"),
                          },
                          valueAsNumber: true,
                        })}
                      />
                    </FormControl>
                    {errors.batch && (
                      <FormHelperText
                        sx={{ color: "red", fontSize: 12, mt: 1 }}
                      >
                        {errors.batch.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid xs={12}>
                    <FormControl error={!!errors.description} required>
                      <FormLabel>{t("createClass.form.description")}</FormLabel>
                      <Textarea
                        minRows={3}
                        placeholder={t(
                          "createClass.form.descriptionPlaceholder"
                        )}
                        {...register("description", {
                          required: t(
                            "createClass.form.errors.descriptionRequired"
                          ),
                        })}
                      />
                    </FormControl>
                    {errors.description && (
                      <FormHelperText
                        sx={{ color: "red", fontSize: 12, mt: 1 }}
                      >
                        {errors.description.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <FormControl error={!!errors.startDate} required>
                      <FormLabel>{t("createClass.form.startDate")}</FormLabel>
                      <Controller
                        name="startDate"
                        control={control}
                        rules={{
                          required: t(
                            "createClass.form.errors.startDateRequired"
                          ),
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
                                endDecorator={<CalendarIcon />}
                              />
                            }
                          />
                        )}
                      />
                    </FormControl>
                    {errors.startDate && (
                      <FormHelperText
                        sx={{ color: "red", fontSize: 12, mt: 1 }}
                      >
                        {errors.startDate.message}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <FormControl error={!!errors.endDate} required>
                      <FormLabel>{t("createClass.form.endDate")}</FormLabel>
                      <Controller
                        name="endDate"
                        control={control}
                        rules={{
                          required: t(
                            "createClass.form.errors.endDateRequired"
                          ),
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
                                endDecorator={<CalendarIcon />}
                              />
                            }
                          />
                        )}
                      />
                    </FormControl>
                    {errors.endDate && (
                      <FormHelperText
                        sx={{ color: "red", fontSize: 12, mt: 1 }}
                      >
                        {errors.endDate.message}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Card>

              <Card variant="outlined" sx={{ mt: 3 }}>
                <Typography level="title-lg" sx={{ mb: 2 }}>
                  {t("createClass.sections.materialsAndCurriculum")}
                </Typography>

                <Alert
                  size="sm"
                  color="secondary"
                  variant="soft"
                  startDecorator={<InfoIcon />}
                  sx={{ mb: 2 }}
                >
                  {t("createClass.sections.materialsNote")}
                </Alert>
              </Card>
            </Grid>

            <Grid xs={12} md={4}>
              <Card variant="soft" color="primary" sx={{ mb: 3 }}>
                <Typography level="title-lg" sx={{ mb: 2 }}>
                  {t("createClass.sections.language")}
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <LanguageIcon color="primary" />
                  <Typography level="title-md">
                    {t("createClass.sections.language")}{" "}
                    {languageData?.data?.languageClass?.languageName}
                  </Typography>
                </Box>

                <Chip size="sm" variant="outlined" color="primary">
                  {languageData?.data?.languageClass?.level}
                </Chip>
              </Card>

              <Card variant="outlined" sx={{ mb: 3 }}>
                <Typography level="title-lg" sx={{ mb: 2 }}>
                  {t("createClass.sections.actions")}
                </Typography>

                <Stack spacing={2}>
                  <Button
                    type="submit"
                    fullWidth
                    size="sm"
                    startDecorator={<SaveIcon />}
                    disabled={isPending}
                    loading={isPending}
                  >
                    {t("common.actions.save")}
                  </Button>

                  <Button
                    component={Link}
                    size="sm"
                    href="/class-setting"
                    variant="outlined"
                    color="neutral"
                    fullWidth
                    disabled={isPending}
                  >
                    {t("common.actions.cancel")}
                  </Button>
                </Stack>
              </Card>

              <Card variant="outlined">
                <Typography level="title-lg">
                  {t("createClass.sections.tips")}
                </Typography>

                <List marker={"disc"}>
                  <ListItem>
                    <Typography level="body-xs">
                      {t("createClass.tips.namingTip")}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography level="body-xs">
                      {t("createClass.tips.scheduleTip")}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography level="body-xs">
                      {t("createClass.tips.descriptionTip")}
                    </Typography>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </form>
      )}

      {isSuccess && (
        <ClassScheduleManager
          classId={classData?.data?.id as string}
          data={classData?.data}
          readOnly={false}
        />
      )}
    </Box>
  );
}
