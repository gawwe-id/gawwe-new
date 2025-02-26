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
        showSnackbar("User Profile berhasil diubah!", "success");

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
        <Typography level="title-md">Profile</Typography>
        <Typography level="body-sm">
          Ubah identitas Profile Kamu bia memang diperlukan
        </Typography>
      </Box>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ my: 1 }}>
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
              <FormLabel>Jenis Kelamin</FormLabel>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Jenis Kelamin harus dipilih" }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    size="sm"
                    placeholder="Pilih Jenis Kelamin"
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
                      selected={new Date(field.value)}
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
                render={({ field }) => (
                  <Select
                    {...field}
                    size="sm"
                    placeholder="Pilih Pendidikan"
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
              Batalkan
            </Button>
            <Button
              size="sm"
              variant="soft"
              loading={isUpdating}
              disabled={!isDirty || isUpdating}
              type="submit"
            >
              Simpan
            </Button>
          </CardActions>
        </CardOverflow>
      </form>
    </Card>
  );
};

export default ProfileInfo;
