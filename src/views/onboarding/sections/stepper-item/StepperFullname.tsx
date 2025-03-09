"use client";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@mui/joy";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useOnboardingState } from "@/store/useOnboardingState";
import { useTranslation } from "react-i18next";

// assets
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";

interface StepperFullnameProps {
  handleBack: () => void;
  handleNext: () => void;
}

const StepperFullname = ({ handleBack, handleNext }: StepperFullnameProps) => {
  const { updateUser, user } = useOnboardingState();
  const { t } = useTranslation("onboarding");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
    },
  });

  const onSubmit: SubmitHandler<{ name: string | null | undefined }> = (
    data
  ) => {
    if (data) {
      updateUser({ name: data.name });
      handleNext();
    }
  };

  return (
    <Box mt={4} width={"50%"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl error={!!errors.name}>
          <FormLabel>{t("personal.fullName")}</FormLabel>
          <Controller
            name="name"
            control={control}
            rules={{ required: t("personal.fullNameRequired") }}
            render={({ field }) => (
              <Input
                {...field}
                size="lg"
                variant="outlined"
                sx={{ minWidth: 400 }}
                value={field.value || ""}
                placeholder={t("personal.fullNamePlaceholder")}
                error={!!errors.name}
              />
            )}
          />
          {errors.name && (
            <FormHelperText>{errors.name.message}</FormHelperText>
          )}
        </FormControl>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={10}
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

export default StepperFullname;
