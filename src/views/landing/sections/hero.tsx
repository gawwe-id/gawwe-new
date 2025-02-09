"use client";

import Link from "next/link";

import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import WrapperHero from "@/layout/SimpleLayout/WrapperHero";

export default function Hero() {
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
        Speak Fluent, Work Abroad
      </Typography>
      <Typography
        textColor="text.secondary"
        sx={{ fontSize: "lg", lineHeight: "lg" }}
      >
        Platform pelatihan bahasa asing dan sertifikasi untuk karier profesional
        di luar negeri.
      </Typography>
      <Link href="/register">
        <Button size="md" endDecorator={<ArrowForward fontSize="large" />}>
          Get Started
        </Button>
      </Link>
      <Typography>
        Sudah mendaftar? <Link href="/login">Sign in</Link>
      </Typography>
    </WrapperHero>
  );
}
