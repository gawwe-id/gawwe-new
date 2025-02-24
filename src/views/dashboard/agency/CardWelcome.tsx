import { auth } from "@/lib/auth";
import { EditRounded } from "@mui/icons-material";
import { Avatar, Button, Sheet, Stack, Typography } from "@mui/joy";
import Link from "next/link";

export default async function CardWelcome() {
  const session = await auth();

  return (
    <Sheet
      variant="outlined"
      color="primary"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: { xs: 2, sm: 3 },
        borderRadius: "md",
        p: { xs: 2, sm: 3 },
        mb: 3,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 2 }}
        alignItems={{ xs: "center", sm: "center" }}
        width="100%"
      >
        <Avatar
          src={session?.user?.image as string}
          size="md"
          sx={{
            width: { xs: 56, sm: 48 },
            height: { xs: 56, sm: 48 },
          }}
        />
        <Stack
          sx={{
            textAlign: { xs: "center", sm: "left" },
            width: "100%",
          }}
        >
          <Typography
            level="h3"
            sx={{
              fontWeight: "900",
              lineHeight: 1.2,
              fontSize: { xs: "xl", sm: "1.25rem" },
            }}
          >
            Welcome Back,{" "}
            <Typography
              color="primary"
              component="span"
              sx={{
                display: { xs: "block", sm: "inline" },
              }}
            >
              {session?.user.name}!
            </Typography>
          </Typography>
          <Typography
            level="body-sm"
            textColor="text.secondary"
            sx={{
              mt: { xs: 0.5, sm: 0 },
            }}
          >
            Profile Kamu sudah <strong>75%</strong> selesai. Lengkapi sekarang!
          </Typography>
        </Stack>
      </Stack>
      <Link href="/account" style={{ textDecoration: "none" }}>
        <Button
          variant="soft"
          color="primary"
          startDecorator={<EditRounded />}
          sx={{
            width: { xs: "100%", sm: "auto" },
            mt: { xs: 1, sm: 0 },
            cursor: "pointer",
          }}
        >
          Lengkapi
        </Button>
      </Link>
    </Sheet>
  );
}
