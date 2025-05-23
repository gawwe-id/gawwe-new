"use client";

import NextLink from "next/link";
import { useTranslation } from "react-i18next";

// joy ui
import { Link, Stack, Typography } from "@mui/joy";

// project import
import AuthWrapper from "./sections/AuthWrapper";
import AuthLogin from "./sections/AuthLogin";

// assets
import login_image from "@/assets/images/login.png";

// ==============================|| LOGIN PAGE ||============================== //

export default function SignIn() {
  const { t } = useTranslation("auth");

  return (
    <AuthWrapper image={login_image}>
      <Stack sx={{ gap: 4, mb: 2 }}>
        <Stack sx={{ gap: 1 }}>
          <Typography component="h1" level="h3">
            {t("signIn.title")}
          </Typography>
          <Typography level="body-sm">
            {t("signIn.noAccount")}{" "}
            <Link
              href="/register"
              component={NextLink}
              level="title-sm"
              scroll={false}
            >
              {t("signIn.signUp")}
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
