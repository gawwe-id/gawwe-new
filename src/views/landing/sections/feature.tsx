"use client"

import { Card, Container, Grid, Typography } from "@mui/joy"

function CardFeature({
  emoji,
  title,
  description,
}: {
  emoji: string
  title: string
  description: string
}) {
  return (
    <Card
      size="lg"
      variant="soft"
      color="neutral"
      invertedColors
      sx={{ borderRadius: "xl" }}
    >
      <Typography level="h3">{emoji}</Typography>
      <Typography level="h4">{title}</Typography>
      <Typography level="body-sm">{description}</Typography>
    </Card>
  )
}

export default function Feature() {
  return (
    <Container sx={{ pb: 10 }}>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={12} sm={6} md={3}>
          <CardFeature
            emoji="🗣️"
            title="Pelatihan Bahasa Terarah"
            description="Program belajar disesuaikan dengan kebutuhan industri dan negara tujuan untuk karier optimal."
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <CardFeature
            emoji="🎓"
            title="Sertifikasi Resmi"
            description="Sertifikat bahasa kredibel yang mempermudah proses rekrutmen dan diakui internasional."
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <CardFeature
            emoji="🌍"
            title="Peluang Kerja Global"
            description="Terhubung langsung dengan agensi serta perusahaan luar negeri untuk kesempatan kerja."
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <CardFeature
            emoji="🤝"
            title="Bimbingan Karier"
            description="Mendapatkan dukungan penuh dari pendaftaran hingga penempatan di negara tujuan kerja."
          />
        </Grid>
      </Grid>
    </Container>
  )
}
