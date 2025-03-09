"use client";

import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { Button, Typography, Sheet, Stack, Divider, Alert } from "@mui/joy";
import { Google, ErrorOutlineRounded, Email } from "@mui/icons-material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthError() {
  const { t } = useTranslation("auth");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const error = searchParams.get("error");

  const isOAuthNotLinked = error === "OAuthAccountNotLinked";

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setAuthError(
          result.error === "AccessDenied"
            ? t("errors.authFailed")
            : t("errors.serverError")
        );
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      setAuthError(t("errors.serverError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = () => {
    router.push("/auth/signin");
  };

  return (
    <Sheet
      variant="plain"
      sx={{
        maxWidth: 400,
        mx: "auto",
        my: 4,
        py: 3,
        px: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "sm",
        boxShadow: "md",
      }}
    >
      <div>
        <Typography level="h4" component="h1" sx={{ mb: 2 }}>
          {isOAuthNotLinked
            ? t("errors.accountNotLinkedTitle")
            : t("errors.genericErrorTitle")}
        </Typography>

        <Alert
          color="warning"
          startDecorator={<ErrorOutlineRounded />}
          sx={{ mb: 2 }}
        >
          {isOAuthNotLinked
            ? t("errors.accountNotLinkedMessage")
            : t("errors." + error, t("errors.genericErrorMessage"))}
        </Alert>
      </div>

      {isOAuthNotLinked && (
        <>
          <Stack spacing={2}>
            <Button
              startDecorator={<Google />}
              variant="outlined"
              color="neutral"
              fullWidth
              onClick={handleGoogleSignIn}
              loading={isLoading}
            >
              {t("signIn.withGoogle")}
            </Button>

            <Divider>{t("signIn.or")}</Divider>

            <Button
              startDecorator={<Email />}
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleEmailSignIn}
            >
              {t("signIn.withEmail")}
            </Button>
          </Stack>

          {authError && (
            <Alert
              color="danger"
              startDecorator={<ErrorOutlineRounded />}
              sx={{ mt: 2 }}
            >
              {authError}
            </Alert>
          )}
        </>
      )}
    </Sheet>
  );
}
