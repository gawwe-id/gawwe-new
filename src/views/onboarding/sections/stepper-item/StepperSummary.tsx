import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";

// project import
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

// assets
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import {
  LocationOnRounded,
  SchoolRounded,
  PeopleAltRounded,
} from "@mui/icons-material";

// types
import { User } from "@/server/db/schema/users";
import { NewProfileParticipant } from "@/server/db/schema/profileParticipants";
import { NewProfileAgencies } from "@/server/db/schema/profileAgencies";
import { useSession } from "next-auth/react";

// types

interface StepperSummaryProps {
  handleBack: () => void;
}

const StepperSummary = ({ handleBack }: StepperSummaryProps) => {
  const { data: session } = useSession();
  const user = useOnboardingStore((state) => state.user);
  const agency = useOnboardingStore((state) => state.profileAgency);
  const participant = useOnboardingStore((state) => state.profileParticipant);

  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const { data: educationLevel } = useQuery({
    queryKey: ["education-level"],
    queryFn: async () => {
      const response = await client.educationLevels.single.$get({
        educationId: participant?.educationLevelId as string,
      });
      return await response.json();
    },
  });

  // Function to get profile data based on role
  const getProfileData = () => {
    const isParticipant = user?.role?.toLowerCase() === "participant";

    return {
      account: {
        role: user?.role || "-",
        fullName: user?.name || "-",
      },
      profile: isParticipant
        ? {
            phoneNumber: participant?.phone || "-",
            gender: participant?.gender || "-",
            birthDate: participant?.birthDate || "-",
            education: educationLevel?.data?.name || "-",
          }
        : {
            phoneNumber: agency?.phone || "-",
            displayName: agency?.displayName || "-",
            bio: agency?.bio || "-",
          },
      address: {
        fullAddress: isParticipant
          ? participant?.address
          : agency?.address || "-",
        province: isParticipant
          ? participant?.province
          : agency?.province || "-",
        regency: isParticipant ? participant?.regency : agency?.regency || "-",
        district: isParticipant
          ? participant?.district
          : agency?.district || "-",
        village: isParticipant ? participant?.village : agency?.village || "-",
        postalCode: isParticipant
          ? participant?.postalCode
          : agency?.postalCode || "-",
      },
    };
  };

  const userData = getProfileData();

  const SectionHeader = ({
    icon,
    title,
  }: {
    icon: React.ReactElement;
    title: string;
  }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2,
      }}
    >
      {icon}
      <Typography level="h4" component="h2">
        {title}
      </Typography>
    </Box>
  );

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <Box sx={{ mb: 1 }}>
      <Typography level="body-sm" textColor="text.secondary" fontWeight="bold">
        {label}
      </Typography>
      <Typography level="body-md" color="neutral">
        {value || "-"}
      </Typography>
    </Box>
  );

  // Mutate UPDATE USER
  const { mutate: muatateUpdateUser, isPending: isUser } = useMutation({
    mutationFn: async ({
      updateUser,
      userId,
    }: {
      updateUser: Partial<User>;
      userId: string;
    }) => {
      const res = await client.users.update.$post({
        updateUser,
        userId,
      });
      return await res.json();
    },
    onSuccess: async () => {
      if (participant) {
        createParticipant({
          ...participant,
          userId: session?.user.id ?? "",
          imageUrl: participant?.imageUrl ?? "",
          gender: participant?.gender ?? "",
          birthDate: dayjs(participant?.birthDate).format("DD-MM-YYYY") ?? "",
          phone: participant?.phone ?? "",
          address: participant?.address ?? "",
          province: participant?.province ?? "",
          regency: participant?.regency ?? "",
          district: participant?.district ?? "",
          village: participant?.village ?? "",
          postalCode: participant?.postalCode ?? "",
          educationLevelId: participant?.educationLevelId ?? "",
        });
      } else if (agency) {
        createAgency({
          ...agency,
          // id: agency?.id ?? "", // Ensure id is always a string
          userId: session?.user.id ?? "",
          displayName: agency?.displayName ?? "",
          imageUrl: agency?.imageUrl ?? "",
          phone: agency?.phone ?? "",
          bio: agency?.bio ?? "",
          address: agency?.address ?? "",
          province: agency?.province ?? "",
          regency: agency?.regency ?? "",
          district: agency?.district ?? "",
          village: agency?.village ?? "",
          postalCode: agency?.postalCode ?? "",
        });
      }
    },
    onError: () => {
      showSnackbar("Failed to update user profile!", "danger");
    },
  });

  // Mutate CREATE PARTICIPANT
  const { mutate: createParticipant, isPending: isParticipant } = useMutation({
    mutationFn: async (data: NewProfileParticipant) => {
      const res = await client.profileParticipants.create.$post(data);
      return res.json();
    },
    onSuccess: () => {
      showSnackbar("Profile created successfully!", "success");
      router.push("/dashboard");
    },
    onError: () => {
      showSnackbar("Failed to create participant profile!", "danger");
    },
  });

  const { mutate: createAgency, isPending: isAgency } = useMutation({
    mutationFn: async (data: NewProfileAgencies) => {
      const res = await client.profileAgencies.create.$post(data);
      return res.json();
    },
    onSuccess: () => {
      showSnackbar("Profile created successfully!", "success");
      router.push("/dashboard");
    },
    onError: () => {
      showSnackbar("Failed to create agency profile!", "danger");
    },
  });

  const handleRegisterDetail = () => {
    if (!user) {
      showSnackbar("User data is required!", "danger");
      return;
    }

    if (!participant && !agency) {
      showSnackbar(
        "Either participant or agency profile is required!",
        "danger"
      );
      return;
    }

    // Collect User Update Payload
    const userPayload = {
      role: user.role,
      image: user.image,
      name: user.name,
      profileCompletion: 1,
    };

    muatateUpdateUser({
      updateUser: userPayload,
      userId: session?.user.id ?? "",
    });
  };

  const isLoading = isUser || isAgency || isParticipant;

  return (
    <Box width={"100%"} mt={4}>
      <Grid container spacing={2}>
        {/* Profile Section */}
        <Grid xs={12}>
          <Card variant="plain">
            <CardContent>
              <SectionHeader
                icon={
                  user?.image ? (
                    <Avatar
                      sx={{ height: 40, width: 40 }}
                      src={user?.image ?? ""}
                    />
                  ) : (
                    <Avatar sx={{ height: 40, width: 40 }} />
                  )
                }
                title="Profil"
              />
              <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={3}>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      level="body-sm"
                      textColor="text.secondary"
                      fontWeight="bold"
                    >
                      Role
                    </Typography>
                    <Chip
                      variant="soft"
                      color="primary"
                      sx={{ textTransform: "capitalize" }}
                      startDecorator={
                        userData?.account?.role === "agency" ? (
                          <SchoolRounded />
                        ) : (
                          <PeopleAltRounded />
                        )
                      }
                    >
                      {userData?.account?.role}
                    </Chip>
                  </Box>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <InfoItem
                    label="Nama Lengkap"
                    value={userData.account.fullName}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <InfoItem
                    label="Nomor HP"
                    value={userData.profile.phoneNumber}
                  />
                </Grid>
                {user?.role?.toLowerCase() === "participant" ? (
                  <>
                    <Grid xs={12} sm={6} md={3}>
                      <InfoItem
                        label="Jenis Kelamin"
                        value={
                          userData.profile.gender === "L"
                            ? "Laki-Laki"
                            : "Perempuan"
                        }
                      />
                    </Grid>
                    <Grid xs={12} sm={6} md={3}>
                      <InfoItem
                        label="Tanggal Lahir"
                        value={
                          dayjs(userData.profile.birthDate).format(
                            "DD MMMM YYYY"
                          ) ?? ""
                        }
                      />
                    </Grid>
                    <Grid xs={12} sm={6} md={3}>
                      <InfoItem
                        label="Pendidikan"
                        value={userData.profile.education ?? ""}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid xs={12} sm={6} md={3}>
                      <InfoItem
                        label="Nama Agensi"
                        value={userData.profile.displayName ?? ""}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <InfoItem
                        label="Bio"
                        value={userData.profile.bio ?? ""}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Address Section */}
        <Grid xs={12}>
          <Card variant="plain">
            <CardContent>
              <SectionHeader icon={<LocationOnRounded />} title="Domisili" />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <InfoItem
                  label="Alamat Lengkap"
                  value={userData.address.fullAddress ?? ""}
                />
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6} md={3}>
                    <InfoItem
                      label="Provinsi"
                      value={userData.address.province ?? ""}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <InfoItem
                      label="Kota/Kabupaten"
                      value={userData.address.regency ?? ""}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <InfoItem
                      label="Kecamatan"
                      value={userData.address.district ?? ""}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <InfoItem
                      label="Kelurahan/Desa"
                      value={userData.address.village ?? ""}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} md={3}>
                    <InfoItem
                      label="Kode Pos"
                      value={userData.address.postalCode ?? ""}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack pt={2}>
        <Typography level="body-xs">
          * Pastikan semua data yang Anda input sudah benar
        </Typography>
      </Stack>

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
          disabled={isLoading}
          onClick={handleBack}
        >
          Kembali
        </Button>
        <Button
          size="sm"
          color="primary"
          type="submit"
          variant="soft"
          endDecorator={<SendRoundedIcon />}
          loading={isLoading}
          onClick={handleRegisterDetail}
        >
          Daftarkan
        </Button>
      </Stack>
    </Box>
  );
};

export default StepperSummary;
