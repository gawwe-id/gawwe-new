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
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

// import
import { client } from "@/lib/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/hooks/useSnackbar";
import { ProfileAgencies } from "@/server/db/schema/profileAgencies";

// assets
import {
  LocalPhoneRounded,
  DriveFileRenameOutlineRounded,
} from "@mui/icons-material";

// types
interface ProfileInfoProps {
  profile: ProfileAgencies | undefined;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileAgencies>({
    defaultValues: {
      bio: "",
      displayName: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        bio: profile.bio,
        displayName: profile.displayName,
        phone: profile.phone,
      });
    }
  }, [profile]);

  const handleReset = () => {
    reset({
      bio: "",
      displayName: "",
      phone: "",
    });
  };

  const { mutate: mutateUpdateAgency, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      updateProfile,
      id,
    }: {
      updateProfile: Partial<ProfileAgencies>;
      id: string;
    }) => {
      const res = await client.profileAgencies.update.$post({
        id,
        updateProfile,
      });
      return await res.json();
    },
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      showSnackbar("User Profile berhasil diubah!", "success");

      reset({
        bio: data.bio,
        displayName: data.displayName,
        phone: data.phone,
      });
    },
  });

  const onSubmit: SubmitHandler<ProfileAgencies> = (data) => {
    mutateUpdateAgency({
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
          <Grid xs={12} sm={6}>
            <Stack spacing={1}>
              <FormLabel>Nama Agency</FormLabel>
              <Controller
                name="displayName"
                control={control}
                rules={{
                  required: "Nama Agency harus diisi",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="displayName"
                    type="text"
                    size="sm"
                    fullWidth
                    startDecorator={<DriveFileRenameOutlineRounded />}
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
              <FormLabel>Nomor HP</FormLabel>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "No HP harus diisi",
                  min: 11,
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
          <Grid xs={12}>
            <Stack spacing={1}>
              <FormLabel>Bio</FormLabel>
              <Controller
                name="bio"
                control={control}
                rules={{
                  required: "Bio harus diisi",
                }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    minRows={3}
                    id="bio"
                    placeholder="Ceritakan menganai Agensi Anda..."
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
