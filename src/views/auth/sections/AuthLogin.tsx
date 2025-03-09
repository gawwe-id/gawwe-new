"use client";

// joy ui
import {
  Alert,
  Button,
  Divider,
  FormLabel,
  Grid,
  Input,
  Stack,
} from "@mui/joy";

// project import
import { useTranslation } from "react-i18next";
import { signIn } from "next-auth/react";
import { ErrorOutlineRounded, Google } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useState } from "react";

// types
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ============================|| LOGIN ||============================ //

export default function AuthLogin() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const email = watch("email");

  const { mutateAsync: checkAuthProvider } = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await client.users.checkAuthProvider.$post({ email });
      return res.json();
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setAuthError(null);

      // If email was entered in the form, check if it's registered with a different provider
      if (email) {
        const { exists, providers } = await checkAuthProvider({ email });

        if (exists && !providers.includes("google")) {
          // User exists but not with Google
          setAuthError(t("errors.useEmailSignIn"));
          setIsGoogleLoading(false);
          return;
        }

        console.log(exists);
        console.log(providers);
      }

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
      console.error("Google login error:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const onSubmit = async ({ email }: LoginFormValues) => {
    try {
      setIsEmailLoading(true);
      setAuthError(null);

      const { exists, providers } = await checkAuthProvider({ email });

      if (!exists) {
        setAuthError(t("errors.emailNotRegistered"));
        setIsEmailLoading(false);
        return;
      }

      // Check if user registered with Google but trying to use email
      if (providers.includes("google") && !providers.includes("email")) {
        setAuthError(t("errors.useGoogleSignIn"));
        setIsEmailLoading(false);
        return;
      }

      // Proceed with magic link/passwordless auth
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setAuthError(t("errors.authFailed"));
      } else {
        router.push("/auth/verify-request");
      }
    } catch (error) {
      setAuthError(t("errors.serverError"));
      console.error("Email login error:", error);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const isLoading = isGoogleLoading || isEmailLoading;

  return (
    <>
      {authError && (
        <Alert
          color="danger"
          startDecorator={<ErrorOutlineRounded />}
          sx={{ mb: 2 }}
        >
          {authError}
        </Alert>
      )}

      <Stack mb={4}>
        <Button
          fullWidth
          size="lg"
          variant="soft"
          color="neutral"
          startDecorator={<Google />}
          disabled={isLoading}
          loading={isGoogleLoading}
          onClick={handleGoogleSignIn}
        >
          {isGoogleLoading ? t("signIn.processing") : t("signIn.withGoogle")}
        </Button>
      </Stack>

      <Stack mb={3}>
        <Divider>{t("signIn.or")}</Divider>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack spacing={1}>
              <FormLabel htmlFor="email">{t("signIn.emailLabel")}</FormLabel>
              <Input
                id="email"
                {...register("email")}
                type="email"
                size="lg"
                fullWidth
                sx={{ fontSize: 14 }}
                error={!!errors.email}
              />
              {errors.email && (
                <Alert color="danger" size="sm">
                  {errors.email.message}
                </Alert>
              )}
            </Stack>
          </Grid>

          <Grid xs={12}>
            <Button
              fullWidth
              size="lg"
              variant="soft"
              color="primary"
              type="submit"
              disabled={isLoading}
              loading={isEmailLoading}
              loadingPosition="start"
            >
              {isEmailLoading ? t("signIn.processing") : t("signIn.withEmail")}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
