"use client";

import NextLink from "next/link";
import { useTranslation } from "react-i18next";

// joy ui
import { Link, Stack, Typography } from "@mui/joy";

// project import
import AuthWrapper from "./sections/AuthWrapper";
import AuthError from "./sections/AuthError";

// assets
import error_image from "@/assets/images/error.png";

// ==============================|| ERROR PAGE ||============================== //

export default function Error() {
  const { t } = useTranslation("auth");

  return (
    <AuthWrapper image={error_image}>
      <Stack sx={{ gap: 4, mb: 2 }}>
        <Stack sx={{ gap: 1 }}>
          <Typography component="h1" level="h3">
            {t("errorPage.title")}
          </Typography>
          <Typography level="body-sm">
            {t("errorPage.backToLogin")}{" "}
            <Link
              href="/auth/signin"
              component={NextLink}
              level="title-sm"
              scroll={false}
            >
              {t("errorPage.signIn")}
            </Link>
          </Typography>
        </Stack>
      </Stack>
      <Stack>
        <AuthError />
      </Stack>
    </AuthWrapper>
  );
}
