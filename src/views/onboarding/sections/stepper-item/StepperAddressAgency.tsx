"use client";

// joy ui
import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  Grid,
  Option,
  Select,
  Stack,
  Textarea,
} from "@mui/joy";

// third party
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { client } from "@/lib/client";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useQuery } from "@tanstack/react-query";

// assets
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";

// types
import { ProfileAgencies } from "@/server/db/schema/profileAgencies";
interface RegionData {
  code: string;
  name: string;
  postal_code?: string;
}

interface StepperAddressProps {
  handleBack: () => void;
  handleNext: () => void;
}

const StepperAddressAgency = ({
  handleBack,
  handleNext,
}: StepperAddressProps) => {
  const agency = useOnboardingStore((state) => state.profileAgency);
  const setProfileAgency = useOnboardingStore(
    (state) => state.setProfileAgency
  );

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileAgencies>({
    defaultValues: {
      address: agency?.address || "",
      province: agency?.province || "",
      regency: agency?.regency || "",
      district: agency?.district || "",
      village: agency?.village || "",
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

  const findSelectedRegion = (
    data: ProfileAgencies,
    regions: RegionData[] | undefined,
    field: keyof ProfileAgencies
  ): RegionData | undefined => {
    return regions?.find((region) => region.code === data[field]);
  };

  const onSubmit: SubmitHandler<ProfileAgencies> = (data) => {
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
        setProfileAgency({ [key]: region.name });
        if (key === "village" && region.postal_code) {
          setProfileAgency({ postalCode: region.postal_code });
        }
      }
    });

    setProfileAgency({ address: data.address });
    handleNext();
  };

  return (
    <Box mt={4} width={"50%"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack spacing={1}>
              <FormLabel>Alamat</FormLabel>
              <Controller
                name="address"
                control={control}
                rules={{
                  required: "Alamat harus diisi",
                }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    minRows={2}
                    id="address"
                    placeholder="Alamat lengkap..."
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
              <FormLabel>Provinsi</FormLabel>
              <Controller
                name="province"
                control={control}
                rules={{ required: "Provinsi harus dipilih" }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    size="sm"
                    placeholder="Pilih Provinsi"
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
              <FormLabel>Kota/Kabupaten</FormLabel>
              <Controller
                name="regency"
                control={control}
                rules={{ required: "Kota/Kabupaten harus dipilih" }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    size="sm"
                    placeholder="Pilih Kota/Kabupaten"
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
              <FormLabel>Kecamatan</FormLabel>
              <Controller
                name="district"
                control={control}
                rules={{ required: "Kecamatan harus dipilih" }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    size="sm"
                    placeholder="Pilih Kecamatan"
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
              <FormLabel>Kelurahan/Desa</FormLabel>
              <Controller
                name="village"
                control={control}
                rules={{ required: "Kelurahan/Desa harus dipilih" }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    size="sm"
                    placeholder="Pilih Kelurahan/Desa"
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
            Kembali
          </Button>
          <Button
            size="sm"
            color="primary"
            type="submit"
            variant="soft"
            endDecorator={<NavigateNextRoundedIcon />}
          >
            Selanjutnya
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default StepperAddressAgency;
