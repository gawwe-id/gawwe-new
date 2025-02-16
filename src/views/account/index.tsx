'use client';

import { Box, Stack, Typography } from '@mui/joy';
import TabsAccount from './settings/TabsAccount';
import AccountInfo from './settings/AccountInfo';
import ProfileInfo from './settings/ProfileInfo';
import AddressInfo from './settings/AddressInfo';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/client';
import { ProfileParticipant } from '@/server/db/schema/profileParticipants';

export default function Account() {
  const { data } = useQuery({
    queryKey: ['profile-participant'],
    queryFn: async () => {
      const res = await client.profileParticipants.single.$get();
      return (await res.json()).data;
    }
  });

  const profile: ProfileParticipant = data;

  return (
    <Box sx={{ px: { xs: 2, md: 6 } }}>
      <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
        My Account
      </Typography>

      <TabsAccount />

      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 }
        }}
      >
        <AccountInfo />
        <ProfileInfo profile={profile} />
        <AddressInfo profile={profile} />
      </Stack>
    </Box>
  );
}
