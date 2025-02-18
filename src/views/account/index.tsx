"use client";

import { Box, Grid, Stack, TabPanel, Tabs, Typography } from "@mui/joy";
import TabsAccount from "./settings/TabsAccount";
import AccountInfo from "./settings/AccountInfo";
import ProfileInfo from "./settings/ProfileInfo";
import AddressInfo from "./settings/AddressInfo";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { ProfileParticipant } from "@/server/db/schema/profileParticipants";
import { useState } from "react";

export default function Account() {
  const [activeTab, setActiveTab] = useState(0);

  const { data } = useQuery({
    queryKey: ["profile-participant"],
    queryFn: async () => {
      const res = await client.profileParticipants.single.$get();
      return await res.json();
    },
  });

  const profile: ProfileParticipant | undefined = data
    ? {
        id: data.data?.id || "",
        postalCode: data.data?.postalCode || "",
        userId: data.data?.userId || "",
        phone: data.data?.phone || "",
        address: data.data?.address || "",
        province: data.data?.province || "",
        regency: data.data?.regency || "",
        district: data.data?.district || "",
        village: data.data?.village || "",
        gender: data.data?.gender || "",
        birthDate: data.data?.birthDate
          ? new Date(data.data.birthDate)
          : new Date(),
        educationLevelId: data.data?.educationLevelId || "",
      }
    : undefined;

  return (
    <Box sx={{ px: { xs: 2, md: 6 } }}>
      <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
        My Account
      </Typography>

      <Tabs
        value={activeTab.toString()}
        onChange={(event, value) => setActiveTab(value as number)}
        sx={{ bgcolor: "transparent" }}
      >
        <TabsAccount />

        <TabPanel value={"0"}>
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
                  <ProfileInfo profile={profile} />
                  <AddressInfo profile={profile} />
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </TabPanel>

        <TabPanel value={"1"}>
          <ProfileInfo profile={profile} />
        </TabPanel>

        <TabPanel value={"2"}>
          <AddressInfo profile={profile} />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
