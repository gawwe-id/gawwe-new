"use client";

import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardOverflow,
  Divider,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";

// import
import { client } from "@/lib/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/hooks/useSnackbar";
import { ProfileParticipant } from "@/server/db/schema/profileParticipants";
import { customHeader, customStyles } from "@/utils/dateSelection";
import { useTranslation } from "react-i18next";

// assets
import {
  LocalPhoneRounded,
  SchoolRounded,
  WcRounded,
  CalendarMonthRounded,
} from "@mui/icons-material";

// types
interface ProfileInfoProps {
  profile: ProfileParticipant | undefined;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation("account");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileParticipant>({
    defaultValues: {
      phone: "",
      gender: "",
      birthDate: new Date(),
      educationLevelId: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        phone: profile.phone,
        gender: profile.gender,
        birthDate: new Date(profile?.birthDate),
        educationLevelId: profile.educationLevelId,
      });
    }
  }, [profile]);

  const { data: educations } = useQuery({
    queryKey: ["educations"],
    queryFn: async () => {
      const res = await client.educationLevels.list.$get();
      return await res.json();
    },
  });

  const handleReset = () => {
    reset({
      phone: "",
      gender: "",
      birthDate: new Date(),
      educationLevelId: "",
    });
  };

  const { mutate: mutateUpdateParticipant, isPending: isUpdating } =
    useMutation({
      mutationFn: async ({
        updateProfile,
        id,
      }: {
        updateProfile: Partial<ProfileParticipant>;
        id: string;
      }) => {
        const res = await client.profileParticipants.update.$post({
          id,
          updateProfile,
        });
        return await res.json();
      },
      onSuccess: async ({ data }) => {
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        showSnackbar(t("notifications.profileUpdateSuccess"), "success");

        reset({
          phone: data?.phone,
          gender: data?.gender,
          birthDate: data?.birthDate ? new Date(data.birthDate) : undefined,
          educationLevelId: data?.educationLevelId,
        });
      },
    });

  const onSubmit: SubmitHandler<ProfileParticipant> = (data) => {
    mutateUpdateParticipant({
      id: profile?.id as string,
      updateProfile: data,
    });
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">{t("profileInfo.title")}</Typography>
        <Typography level="body-sm">{t("profileInfo.subtitle")}</Typography>
      </Box>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ my: 1 }}>
          <Grid xs={6}>
            <Stack spacing={1}>
              <FormLabel>{t("profileInfo.common.phoneNumber")}</FormLabel>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: t("profileInfo.common.phoneRequired"),
                  pattern: {
                    value: /^[0-9]{10,14}$/,
                    message: t("profileInfo.common.phoneInvalid"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    size="sm"
                    fullWidth
                    startDecorator={<LocalPhoneRounded />}
                    value={field.value || ""}
                  />
                )}
              />
            </Stack>
            {errors.phone && (
              <FormHelperText
                sx={{ color: "red", fontSize: 12, mt: 1 }}
                id="helper-text-phone"
              >
                * {errors?.phone?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid xs={6}>
            <Stack spacing={1}>
              <FormLabel>{t("profileInfo.participant.gender")}</FormLabel>
              <Controller
                name="gender"
                control={control}
                rules={{
                  required: t("profileInfo.participant.genderRequired"),
                }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    size="sm"
                    placeholder={t("profileInfo.participant.selectGender")}
                    startDecorator={<WcRounded />}
                    value={value || ""}
                    onChange={(event, newValue) => {
                      onChange(newValue);
                    }}
                    sx={{
                      zIndex: 1000,
                      position: "relative",
                    }}
                  >
                    <Option value="L">
                      {t("profileInfo.participant.male")}
                    </Option>
                    <Option value="P">
                      {t("profileInfo.participant.female")}
                    </Option>
                  </Select>
                )}
              />
            </Stack>
            {errors.gender && (
              <FormHelperText
                sx={{ color: "red", fontSize: 12, mt: 1 }}
                id="helper-text-gender"
              >
                * {errors?.gender?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid xs={6}>
            <Stack spacing={1}>
              <FormLabel> {t("profileInfo.participant.birthDate")}</FormLabel>
              <style>{customStyles}</style>
              <Controller
                name="birthDate"
                control={control}
                rules={{
                  required: t("profileInfo.participant.birthDateRequired"),
                  validate: {
                    notFuture: (value) => {
                      if (value && dayjs(value) > dayjs()) {
                        return t(
                          "profileInfo.participant.fembirthDateFutureale"
                        );
                      }
                      return true;
                    },
                    notTooOld: (value) => {
                      if (value && dayjs(value) < dayjs("1900-01-01")) {
                        return t("profileInfo.participant.birthDateInvalid");
                      }
                      return true;
                    },
                  },
                }}
                render={({ field }) => {
                  return (
                    <DatePicker
                      onChange={field.onChange}
                      selected={new Date(field.value)}
                      dateFormat="yyyy-MM-dd"
                      renderCustomHeader={customHeader}
                      placeholderText={t("profileInfo.participant.selectDate")}
                      ref={field.ref}
                      customInput={
                        <Input
                          id="birthDate"
                          size="sm"
                          fullWidth
                          startDecorator={<CalendarMonthRounded />}
                        />
                      }
                    />
                  );
                }}
              />
            </Stack>
            {errors.birthDate && (
              <FormHelperText
                sx={{ color: "red", fontSize: 12, mt: 1 }}
                id="helper-text-birthDate"
              >
                * {errors?.birthDate?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid xs={6}>
            <Stack spacing={1}>
              <FormLabel>{t("profileInfo.participant.education")}</FormLabel>
              <Controller
                name="educationLevelId"
                control={control}
                rules={{
                  required: t("profileInfo.participant.educationRequired"),
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="sm"
                    placeholder={t("profileInfo.participant.selectEducation")}
                    startDecorator={<SchoolRounded />}
                    value={field.value || ""}
                    onChange={(_, newValue) => field.onChange(newValue)}
                  >
                    {educations?.data?.map((education) => (
                      <Option key={education.id} value={education.id}>
                        {education.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Stack>
            {errors.educationLevelId && (
              <FormHelperText
                sx={{ color: "red", fontSize: 12, mt: 1 }}
                id="helper-text-educationLevelId"
              >
                * {errors?.educationLevelId?.message}
              </FormHelperText>
            )}
          </Grid>
        </Grid>
        <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
          <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              disabled={!isDirty || isUpdating}
              onClick={handleReset}
              type="button"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              size="sm"
              variant="soft"
              loading={isUpdating}
              disabled={!isDirty || isUpdating}
              type="submit"
            >
              {t("buttons.save")}
            </Button>
          </CardActions>
        </CardOverflow>
      </form>
    </Card>
  );
};

export default ProfileInfo;
