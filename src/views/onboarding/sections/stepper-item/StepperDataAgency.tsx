"use client";

import React from "react";
import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Stack,
  Textarea,
} from "@mui/joy";

//thrd party
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

// import
import { useOnboardingState } from "@/store/useOnboardingState";

// assets
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";

//types
import { ProfileAgencies } from "@/server/db/schema/profileAgencies";

interface StepperDataAgencyProps {
  handleBack: () => void;
  handleNext: () => void;
}

const StepperDataAgency = ({
  handleBack,
  handleNext,
}: StepperDataAgencyProps) => {
  const { profileAgency, setProfileAgency } = useOnboardingState();
  const { t } = useTranslation("onboarding");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<ProfileAgencies>>({
    defaultValues: {
      phone: profileAgency?.phone || "",
      displayName: profileAgency?.displayName || "",
      bio: profileAgency?.bio || "",
    },
  });

  const onSubmit: SubmitHandler<Partial<ProfileAgencies>> = (data) => {
    if (data) {
      setProfileAgency({
        ...profileAgency,
        displayName: data.displayName,
        phone: data.phone,
        bio: data.bio,
      });
      handleNext();
    }
  };

  return (
    <Box mt={4} width={"50%"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12} sm={6}>
            <Stack spacing={1}>
              <FormLabel>{t("personal.agencyName")}</FormLabel>
              <Controller
                name="displayName"
                control={control}
                rules={{
                  required: t("personal.agencyNameRequired"),
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="displayName"
                    type="text"
                    size="sm"
                    fullWidth
                    value={field.value || ""}
                  />
                )}
              />
            </Stack>
            {errors.displayName && (
              <FormHelperText
                sx={{ color: "red", fontSize: 12, mt: 1 }}
                id="helper-text-displayName"
              >
                * {errors?.displayName?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid xs={12} sm={6}>
            <Stack spacing={1}>
              <FormLabel>{t("personal.phoneNumber")}</FormLabel>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: t("personal.phoneRequired"),
                  min: 11,
                  pattern: {
                    value: /^[0-9]{10,14}$/,
                    message: t("personal.phoneInvalid"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    size="sm"
                    fullWidth
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
          <Grid xs={12}>
            <Stack spacing={1}>
              <FormLabel>{t("personal.bio")}</FormLabel>
              <Controller
                name="bio"
                control={control}
                rules={{
                  required: t("personal.bioRequired"),
                }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    minRows={3}
                    id="bio"
                    placeholder={t("personal.bioPlaceholder")}
                    value={field.value || ""}
                  />
                )}
              />
            </Stack>
            {errors.bio && (
              <FormHelperText
                sx={{ color: "red", fontSize: 12, mt: 1 }}
                id="helper-text-bio"
              >
                * {errors?.bio?.message}
              </FormHelperText>
            )}
          </Grid>
        </Grid>

        <Stack
          mt={10}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            size="sm"
            color="neutral"
            variant="soft"
            startDecorator={<NavigateBeforeRoundedIcon />}
            onClick={handleBack}
          >
            {t("buttons.back")}
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="soft"
            type="submit"
            endDecorator={<NavigateNextRoundedIcon />}
          >
            {t("buttons.next")}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default StepperDataAgency;
