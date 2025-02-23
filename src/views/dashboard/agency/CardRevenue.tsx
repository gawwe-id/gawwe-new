"use client";

import dynamic from "next/dynamic";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/joy";

// Dynamically import ApexCharts
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CardRevenue = () => {
  const revenueChartSeries = [
    {
      name: "Revenue",
      data: [25, 30, 35, 20, 35, 45, 30, 35, 25, 30, 20],
    },
  ];

  // Chart options
  const revenueChartOptions = {
    chart: {
      type: "bar" as "bar",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    colors: [
      "#E7EBF0",
      "#E7EBF0",
      "#E7EBF0",
      "#E7EBF0",
      "#E7EBF0",
      "#7B6CF6",
      "#E7EBF0",
      "#E7EBF0",
      "#E7EBF0",
      "#E7EBF0",
      "#E7EBF0",
      "#E7EBF0",
    ],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "July",
        "Aug",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      labels: {
        formatter: (value: any) => `${value}k`,
      },
    },
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography level="h4">Revenue Chart</Typography>
          <Button variant="plain">This Year</Button>
        </Stack>
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <Chart
            options={{
              ...revenueChartOptions,
              chart: {
                ...revenueChartOptions.chart,
                width: "100%",
                height: 350,
              },
            }}
            series={revenueChartSeries}
            type="bar"
            height={350}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardRevenue;
