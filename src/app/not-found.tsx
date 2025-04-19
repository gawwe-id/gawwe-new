"use client";

import { Button, Box, Typography, Container } from "@mui/joy";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function NotFoundContent() {
  const { t } = useTranslation("notFound");
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  if (!isMounted) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.surface",
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography level="h1">{t("title")}</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.surface",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          py: { xs: 4, sm: 6, md: 8 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            mb: 4,
            position: "relative",
            width: { xs: "200px", sm: "300px", md: "400px" },
            height: { xs: "200px", sm: "300px", md: "400px" },
          }}
        >
          <Image
            src="/404-illustration.svg"
            alt="404 Illustration"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </Box>

        <Typography
          level="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
            mb: 2,
          }}
        >
          {t("title")}
        </Typography>

        <Typography
          level="h3"
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
            mb: 2,
            color: "neutral.500",
          }}
        >
          {t("subtitle")}
        </Typography>

        <Typography
          sx={{
            mb: 4,
            maxWidth: "600px",
            color: "text.secondary",
          }}
        >
          {t("description")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            component={Link}
            href="/"
            size="lg"
            variant="soft"
            color="primary"
            sx={{
              minWidth: { xs: "100%", sm: "150px" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {t("goHome")}
          </Button>
          <Button
            onClick={handleGoBack}
            size="lg"
            variant="outlined"
            color="neutral"
            sx={{
              minWidth: { xs: "100%", sm: "150px" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {t("goBack")}
          </Button>
        </Box>

        <Typography
          level="body-sm"
          sx={{
            mt: 6,
            color: "text.tertiary",
          }}
        >
          {t("errorCode")}
        </Typography>
      </Container>
    </Box>
  );
}
