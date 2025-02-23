import { Card, CardContent, Grid, Typography } from "@mui/joy";

export default async function CardStats() {
  // Stats data
  const stats = [
    {
      title: "Total Projects",
      count: "10,724",
      subtitle: "All running & completed projects",
      highlight: true,
    },
    {
      title: "Completed Projects",
      count: "9,801",
      subtitle: "+17% Completion rate this month",
    },
    {
      title: "Running Projects",
      count: "923",
      subtitle: "+8% Running projects increases",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {stats.map((stat, index) => (
        <Grid key={index} xs={12} sm={6} md={4}>
          <Card variant={"outlined"} color={"neutral"} sx={{ flex: 1 }}>
            <CardContent>
              <Typography level="title-md">{stat.title}</Typography>
              <Typography level="h2" sx={{ my: 1 }}>
                {stat.count}
              </Typography>
              <Typography level="body-sm">{stat.subtitle}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
