import { MailOutlineRounded } from "@mui/icons-material";
import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/joy";

export default function VerifyRequest() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.level1",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: 400,
          width: "90%",
          boxShadow: "sm",
        }}
      >
        <CardContent>
          <Stack spacing={3} alignItems="center">
            <MailOutlineRounded
              sx={{
                fontSize: "4rem",
                color: "primary.500",
              }}
            />

            <Typography level="h3" textAlign="center">
              Cek Email Anda
            </Typography>

            <Divider />

            <Stack spacing={2}>
              <Typography textAlign="center" level="title-md">
                Link untuk login telah dikirim ke alamat email Anda.
              </Typography>

              <Typography textAlign="center" level="body-md">
                Silakan buka email Anda dan klik link yang telah kami kirimkan
                untuk melanjutkan proses login.
              </Typography>

              <Typography
                textAlign="center"
                level="body-sm"
                sx={{ color: "warning.500" }}
              >
                *Jika Anda tidak menerima email dalam beberapa menit, mohon
                periksa folder spam Anda
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
