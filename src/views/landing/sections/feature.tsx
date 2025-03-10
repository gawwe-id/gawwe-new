"use client";

import { Card, Container, Grid, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

function CardFeature({
  emoji,
  titleKey,
  descriptionKey,
}: {
  emoji: string;
  titleKey: string;
  descriptionKey: string;
}) {
  const { t } = useTranslation("landing");

  return (
    <Card
      size="lg"
      variant="soft"
      color="neutral"
      invertedColors
      sx={{ borderRadius: "xl" }}
    >
      <Typography level="h3">{emoji}</Typography>
      <Typography level="h4">{t(titleKey)}</Typography>
      <Typography level="body-sm">{t(descriptionKey)}</Typography>
    </Card>
  );
}

export default function Feature() {
  const { t } = useTranslation("landing");

  return (
    <Container sx={{ pb: 10 }}>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={6} md={3}>
          <CardFeature
            emoji="🗣️"
            titleKey={t("feature.language.title")}
            descriptionKey={t("feature.language.description")}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <CardFeature
            emoji="🎓"
            titleKey={t("feature.certification.title")}
            descriptionKey={t("feature.certification.description")}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <CardFeature
            emoji="🌍"
            titleKey={t("feature.global.title")}
            descriptionKey={t("feature.global.description")}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <CardFeature
            emoji="🤝"
            titleKey={t("feature.guidance.title")}
            descriptionKey={t("feature.guidance.description")}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
