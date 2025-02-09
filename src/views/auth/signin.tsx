import NextLink from "next/link";

// joy ui
import { Link, Stack, Typography } from "@mui/joy";

// project import
import AuthWrapper from "./sections/AuthWrapper";
import AuthLogin from "./sections/AuthLogin";

// assets
import login_image from "@/assets/images/login.png";

// ==============================|| LOGIN PAGE ||============================== //

export default async function SignIn() {
  return (
    <AuthWrapper image={login_image}>
      <Stack sx={{ gap: 4, mb: 2 }}>
        <Stack sx={{ gap: 1 }}>
          <Typography component="h1" level="h3">
            Sign In
          </Typography>
          <Typography level="body-sm">
            Belum memiliki akun?{" "}
            <Link
              href="/register"
              component={NextLink}
              level="title-sm"
              scroll={false}
            >
              Sign Up!
            </Link>
          </Typography>
        </Stack>
      </Stack>
      <Stack>
        <AuthLogin />
      </Stack>
    </AuthWrapper>
  );
}
