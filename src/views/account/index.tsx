import { Box, Stack, Typography, } from "@mui/joy";
import TabsAccount from "./sections/TabsAccount";
import AccountInfo from "./sections/AccountInfo";
import ProfileInfo from "./sections/ProfileInfo";

export default function Account() {
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
          py: { xs: 2, md: 3 },
        }}
      >
        <AccountInfo />
        <ProfileInfo />
      </Stack>
    </Box>
  )
}