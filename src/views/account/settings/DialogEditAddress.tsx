"use client";

import { useSnackbar } from "@/hooks/useSnackbar";
import { client } from "@/lib/client";
import { ProfileAgencies } from "@/server/db/schema/profileAgencies";
import { ProfileParticipant } from "@/server/db/schema/profileParticipants";
import { useDialogEditAddressStore } from "@/store/useDialogEditAddressStore";
import { useTranslation } from "react-i18next";

import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  FormLabel,
  Grid,
  Modal,
  ModalDialog,
  Option,
  Select,
  Stack,
  Textarea,
} from "@mui/joy";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

// types
interface RegionData {
  code: string;
  name: string;
  postal_code?: string;
}

const DialogEditAdress = () => {
  const { t } = useTranslation("account");
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { showSnackbar } = useSnackbar();
  const { isOpen, dialogConfig, closeDialog } = useDialogEditAddressStore();

  const profile = dialogConfig?.profile;

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileParticipant>({
    defaultValues: {
      address: profile?.address || "",
      province: profile?.province || "",
      regency: profile?.regency || "",
      district: profile?.district || "",
      village: profile?.village || "",
    },
  });

  const watchProvince = watch("province");
  const watchRegency = watch("regency");
  const watchDistrict = watch("district");

  const { data: provinces } = useQuery({
    queryKey: ["regions", "provinces"],
    queryFn: async () => {
      const response = await client.regions.provinces.$get();
      return response.json();
    },
  });

  const { data: regencies } = useQuery({
    queryKey: ["regions", "regencies", watchProvince],
    queryFn: async () => {
      const response = await client.regions.regencies.$get({
        provinceId: watchProvince,
      });
      return response.json();
    },
    enabled: !!watchProvince,
  });

  const { data: districts } = useQuery({
    queryKey: ["regions", "districts", watchRegency],
    queryFn: async () => {
      const response = await client.regions.districts.$get({
        regencyId: watchRegency,
      });
      return response.json();
    },
    enabled: !!watchRegency,
  });

  const { data: villages } = useQuery({
    queryKey: ["regions", "villages", watchDistrict],
    queryFn: async () => {
      const response = await client.regions.villages.$get({
        districtId: watchDistrict,
      });
      return response.json();
    },
    enabled: !!watchDistrict,
  });

  const { mutate: mutateUpdateParticipant, isPending: isParticipant } =
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
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["profile-participant"],
        });
        showSnackbar(t("notifications.profileUpdateSuccess"), "success");

        closeDialog();
      },
    });

  const { mutate: mutateUpdateAgency, isPending: isAgency } = useMutation({
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["profile-agency"],
      });
      showSnackbar(t("notifications.profileUpdateSuccess"), "success");

      closeDialog();
    },
  });

  const findSelectedRegion = (
    data: ProfileParticipant,
    regions: RegionData[] | undefined,
    field: keyof ProfileParticipant
  ): RegionData | undefined => {
    return regions?.find((region) => region.code === data[field]);
  };

  const onSubmit: SubmitHandler<ProfileParticipant> = (data) => {
    if (!data) return;

    const selectedRegions = {
      province: findSelectedRegion(data, provinces?.data, "province"),
      regency: findSelectedRegion(data, regencies?.data, "regency"),
      district: findSelectedRegion(data, districts?.data, "district"),
      village: findSelectedRegion(data, villages?.data, "village"),
    };

    // Update store with selected region names
    Object.entries(selectedRegions).forEach(([key, region]) => {
      if (region) {
        data = { ...data, [key]: region.name };
        if (key === "village" && region.postal_code) {
          data = { ...data, postalCode: region.postal_code };
        }
      }
    });

    if (session?.user.role === "participant") {
      mutateUpdateParticipant({
        id: profile?.id as string,
        updateProfile: data,
      });
    } else {
      mutateUpdateAgency({
        id: profile?.id as string,
        updateProfile: data,
      });
    }
  };

  const isUpdating = isParticipant || isAgency;

  return (
    <Modal open={isOpen} onClose={closeDialog}>
      <ModalDialog>
        <DialogTitle>{t("editAddress.title")}</DialogTitle>
        <DialogContent>{t("editAddress.subtitle")}</DialogContent>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Stack spacing={1}>
                <FormLabel>{t("editAddress.address")}</FormLabel>
                <Controller
                  name="address"
                  control={control}
                  rules={{
                    required: t("editAddress.addressRequired"),
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      minRows={2}
                      id="address"
                      placeholder={t("editAddress.addressPlaceholder")}
                      value={field.value || ""}
                    />
                  )}
                />
              </Stack>
              {errors.address && (
                <FormHelperText
                  sx={{ color: "red", fontSize: 12, mt: 1 }}
                  id="helper-text-address"
                >
                  * {errors?.address?.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid xs={6}>
              <Stack spacing={1}>
                <FormLabel>{t("editAddress.province")}</FormLabel>
                <Controller
                  name="province"
                  control={control}
                  rules={{ required: t("editAddress.provinceRequired") }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      size="sm"
                      placeholder={t("editAddress.selectProvince")}
                      value={value || ""}
                      onChange={(_, newValue) => onChange(newValue)}
                    >
                      {provinces?.data?.map((province) => (
                        <Option key={province.code} value={province.code}>
                          {province.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.province && (
                  <FormHelperText sx={{ color: "red", fontSize: 12, mt: 1 }}>
                    * {errors.province.message}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid xs={6}>
              <Stack spacing={1}>
                <FormLabel>{t("editAddress.city")}</FormLabel>
                <Controller
                  name="regency"
                  control={control}
                  rules={{ required: t("editAddress.cityRequired") }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      size="sm"
                      placeholder={t("editAddress.selectCity")}
                      value={value || ""}
                      onChange={(_, newValue) => onChange(newValue)}
                      disabled={!watchProvince}
                    >
                      {regencies?.data?.map((regency) => (
                        <Option key={regency.code} value={regency.code}>
                          {regency.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.regency && (
                  <FormHelperText sx={{ color: "red", fontSize: 12, mt: 1 }}>
                    * {errors.regency.message}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid xs={6}>
              <Stack spacing={1}>
                <FormLabel>{t("editAddress.district")}</FormLabel>
                <Controller
                  name="district"
                  control={control}
                  rules={{ required: t("editAddress.districtRequired") }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      size="sm"
                      placeholder={t("editAddress.selectDistrict")}
                      value={value || ""}
                      onChange={(_, newValue) => onChange(newValue)}
                      disabled={!watchRegency}
                    >
                      {districts?.data?.map((district) => (
                        <Option key={district.code} value={district.code}>
                          {district.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.district && (
                  <FormHelperText sx={{ color: "red", fontSize: 12, mt: 1 }}>
                    * {errors.district.message}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid xs={6}>
              <Stack spacing={1}>
                <FormLabel>{t("editAddress.village")}</FormLabel>
                <Controller
                  name="village"
                  control={control}
                  rules={{ required: t("editAddress.villageRequired") }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      size="sm"
                      placeholder={t("editAddress.selectVillage")}
                      value={value || ""}
                      onChange={(_, newValue) => onChange(newValue)}
                      disabled={!watchDistrict}
                    >
                      {villages?.data?.map((village) => (
                        <Option key={village.code} value={village.code}>
                          {village.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.village && (
                  <FormHelperText sx={{ color: "red", fontSize: 12, mt: 1 }}>
                    * {errors.village.message}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
            mt={10}
          >
            <Button
              size="sm"
              color="neutral"
              variant="soft"
              type="button"
              disabled={isUpdating}
              onClick={closeDialog}
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              size="sm"
              color="primary"
              type="submit"
              variant="soft"
              loading={isUpdating}
              disabled={isUpdating}
            >
              {t("editAddress.updateAddress")}
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default DialogEditAdress;
