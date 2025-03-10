"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import WrapperHero from "@/layout/SimpleLayout/WrapperHero";

export default function Hero() {
  const { t } = useTranslation("landing");

  return (
    <WrapperHero>
      <Typography
        level="h1"
        sx={{
          fontWeight: "900",
          fontSize: "clamp(2.875rem, 2.3636rem + 3.1818vw, 3.8rem)",
          lineHeight: 1.2,
        }}
      >
        <Typography color="primary" component="span" sx={{ fontWeight: "800" }}>
          Gawwe
        </Typography>
        <br />
        {t("hero.headline")}
      </Typography>
      <Typography
        textColor="text.secondary"
        sx={{ fontSize: "lg", lineHeight: "lg" }}
      >
        {t("hero.subheadline")}
      </Typography>
      <Link href="/register">
        <Button size="md" endDecorator={<ArrowForward fontSize="large" />}>
          {t("hero.getStarted")}
        </Button>
      </Link>
      <Typography>
        {t("hero.alreadyRegistered")}{" "}
        <Link href="/login">{t("hero.signIn")}</Link>
      </Typography>
    </WrapperHero>
  );
}
