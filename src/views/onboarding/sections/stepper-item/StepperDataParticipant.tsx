"use client";

import React from "react";
import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
} from "@mui/joy";

//thrd party
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";

// import
import { useOnboardingState } from "@/store/useOnboardingState";
import { ProfileParticipant } from "@/server/db/schema/profileParticipants";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { customHeader, customStyles } from "@/utils/dateSelection";

// assets
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";

//types

interface StepperDataParticipantProps {
  handleBack: () => void;
  handleNext: () => void;
}

const StepperDataParticipant = ({
  handleBack,
  handleNext,
}: StepperDataParticipantProps) => {
  const { profileParticipant, setProfileParticipant } = useOnboardingState();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<ProfileParticipant>>({
    defaultValues: {
      phone: profileParticipant?.phone || "",
      gender: profileParticipant?.gender || "",
      birthDate: profileParticipant?.birthDate || new Date(),
      educationLevelId: profileParticipant?.educationLevelId || "",
    },
  });

  const { data: educations } = useQuery({
    queryKey: ["educations"],
    queryFn: async () => {
      const res = await client.educationLevels.list.$get();
      return await res.json();
    },
  });

  const onSubmit: SubmitHandler<Partial<ProfileParticipant>> = (data) => {
    if (data) {
      setProfileParticipant({
        ...profileParticipant,
        phone: data?.phone,
        gender: data?.gender,
        birthDate: data?.birthDate,
        educationLevelId: data?.educationLevelId,
      });
      handleNext();
    }
  };

  return (
    <Box mt={4} width={"50%"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={6}>
            <Stack spacing={1}>
              <FormLabel>Nomor HP</FormLabel>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "No HP harus diisi",
                  pattern: {
                    value: /^[0-9]{10,14}$/,
                    message: "No HP harus berupa angka dan minimal 10 digit",
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
          <Grid xs={6}>
            <Stack spacing={1}>
              <FormLabel>Jenis Kelamin</FormLabel>
              <Controller
                name="gender"
                control={control}
                rules={{
                  required: "Jenis Kelamin harus dipilih",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="sm"
                    placeholder="Pilih Jenis Kelamin"
                    value={field.value || ""}
                    onChange={(_, newValue) => field.onChange(newValue)}
                  >
                    <Option value="L">Laki-laki</Option>
                    <Option value="P">Perempuan</Option>
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
              <FormLabel>Tanggal Lahir</FormLabel>
              <style>{customStyles}</style>
              <Controller
                name="birthDate"
                control={control}
                rules={{
                  required: "Tanggal lahir harus diisi",
                  validate: {
                    notFuture: (value) => {
                      if (value && dayjs(value) > dayjs()) {
                        return "Tanggal lahir tidak boleh lebih dari hari ini";
                      }
                      return true;
                    },
                    notTooOld: (value) => {
                      if (value && dayjs(value) < dayjs("1900-01-01")) {
                        return "Tanggal lahir tidak valid";
                      }
                      return true;
                    },
                  },
                }}
                render={({ field }) => {
                  return (
                    <DatePicker
                      onChange={field.onChange}
                      selected={field.value}
                      dateFormat="yyyy-MM-dd"
                      renderCustomHeader={customHeader}
                      placeholderText="Select date"
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
              <FormLabel>Pendidikan</FormLabel>
              <Controller
                name="educationLevelId"
                control={control}
                rules={{
                  required: "Pendidikan harus dipilih",
                }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    size="sm"
                    placeholder="Pilih Pendidikan"
                    value={value || ""}
                    onChange={(_, newValue) => onChange(newValue)}
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
            Kembali
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="soft"
            type="submit"
            endDecorator={<NavigateNextRoundedIcon />}
          >
            Selanjutnya
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default StepperDataParticipant;
