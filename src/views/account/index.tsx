"use client";

import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { client } from "@/lib/client";
import { ProfileParticipant } from "@/server/db/schema/profileParticipants";
import { ProfileAgencies } from "@/server/db/schema/profileAgencies";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";

import TabsAccount from "./settings/TabsAccount";
import AccountInfo from "./settings/AccountInfo";
import ProfileInfoParticipant from "./participant/ProfileInfo";
import ProfileInfoAgency from "./agency/ProfileInfo";
import AddressInfo from "./settings/AddressInfo";

// Type for profile data based on role
type ProfileData = {
  participant: ProfileParticipant | undefined;
  agency: ProfileAgencies | undefined;
};

// Custom hook for fetching profile data
const useProfileData = (role: string | undefined) => {
  const { data: participant, isLoading: isParticipant } = useQuery({
    queryKey: ["profile-participant"],
    queryFn: async () => {
      const res = await client.profileParticipants.single.$get();
      return res.json();
    },
    enabled: role === "participant",
  });

  const { data: agency, isLoading: isAgency } = useQuery({
    queryKey: ["profile-agency"],
    queryFn: async () => {
      const res = await client.profileAgencies.single.$get();
      return res.json();
    },
    enabled: role === "agency",
  });

  const isLoading = isParticipant || isAgency;

  return { participant, agency, isLoading };
};

// Helper function to transform participant data
const transformParticipantData = (
  data: any
): ProfileParticipant | undefined => {
  if (!data) return undefined;

  return {
    id: data?.data?.id || "",
    postalCode: data?.data?.postalCode || "",
    userId: data?.data?.userId || "",
    phone: data?.data?.phone || "",
    address: data?.data?.address || "",
    province: data?.data?.province || "",
    regency: data?.data?.regency || "",
    district: data?.data?.district || "",
    village: data?.data?.village || "",
    gender: data?.data?.gender || "",
    birthDate: data?.data?.birthDate
      ? new Date(data.data.birthDate)
      : new Date(),
    educationLevelId: data?.data?.educationLevelId || "",
  };
};

// Helper function to transform agency data
const transformAgencyData = (data: any): ProfileAgencies | undefined => {
  if (!data) return undefined;

  return {
    id: data.data.id,
    postalCode: data.data.postalCode,
    userId: data.data.userId,
    displayName: data.data.displayName,
    imageUrl: data.data.imageUrl,
    phone: data.data.phone,
    bio: data.data.bio,
    address: data.data.address,
    province: data.data.province,
    regency: data.data.regency,
    district: data.data.district,
    village: data.data.village,
  };
};

const Account = () => {
  const { t } = useTranslation("account");
  const { data: session } = useSession();
  const role = session?.user?.role;
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("activetab") || "0";

  const handleTabChange = (
    event: React.SyntheticEvent | null,
    newValue: string | number | null
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("activetab", newValue?.toString() || "0");
    router.push(`/account?${params.toString()}`);
  };

  const { participant, agency, isLoading } = useProfileData(role);

  // Transform data based on role
  const profileData: ProfileData = {
    participant: transformParticipantData(participant),
    agency: transformAgencyData(agency),
  };

  // Get current profile based on role
  const profile =
    role === "participant" ? profileData.participant : profileData.agency;

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, maxWidth: "1300px", mx: "auto" }}>
      <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
        {t("pageTitle")}
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ bgcolor: "transparent", mt: 3 }}
      >
        <TabsAccount />

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <CircularProgress size="md" />
          </Box>
        ) : (
          <>
            <TabPanel value="0">
              <Stack
                sx={{
                  display: "flex",
                  maxWidth: "1000px",
                  mx: "auto",
                }}
              >
                <Grid container spacing={2}>
                  <Grid xs={12} sm={4}>
                    <AccountInfo />
                  </Grid>
                  <Grid xs={12} sm={8}>
                    <Stack spacing={2} direction="column">
                      {role === "participant" &&
                        profile &&
                        "gender" in profile && (
                          <>
                            <ProfileInfoParticipant profile={profile} />
                          </>
                        )}
                      {role === "agency" && profile && "bio" in profile && (
                        <>
                          <ProfileInfoAgency profile={profile} />
                        </>
                      )}
                      <AddressInfo profile={profile} />
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </TabPanel>

            <TabPanel value="1">{/* Profile Info Tab Content */}</TabPanel>
            <TabPanel value="2">{/* Address Info Tab Content */}</TabPanel>
          </>
        )}
      </Tabs>
    </Box>
  );
};

export default Account;
