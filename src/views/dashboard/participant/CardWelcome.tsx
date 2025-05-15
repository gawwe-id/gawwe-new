"use client";

import {
  CalendarMonthRounded,
  ClassRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material";
import { Box, Button, Card, Stack, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const CardWelcome = () => {
  const { data: session } = useSession();
  const { t } = useTranslation("dashboard");
  return (
    <Card variant="soft" color="primary" invertedColors sx={{ mb: 3, p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography level="h2" component="h1">
            {t("participant.welcome")}, {session?.user?.name}!
          </Typography>
          <Typography level="body-lg" sx={{ mb: 2, maxWidth: 800 }}>
            {t("participant.welcomeMessage", {
              defaultValue:
                "Continue your language learning journey. Your recent progress shows great improvement!",
            })}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap>
            <Button
              variant="solid"
              color="warning"
              startDecorator={<ClassRounded />}
              component={Link}
              href="/classes"
            >
              {t("participant.exploreClasses")}
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              startDecorator={<CalendarMonthRounded />}
              component={Link}
              href="/calendar"
            >
              {t("participant.viewSchedule")}
            </Button>
          </Stack>
        </Box>
        <Card
          variant="outlined"
          sx={{ p: 2, display: { xs: "none", md: "block" } }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ width: 150, height: 100 }}>
              {/* <Chart
                      options={progressData.options}
                      series={progressData.series}
                      type="radialBar"
                      height={100}
                    /> */}
            </Box>
            <Box>
              <Typography level="title-md">Overall Progress</Typography>
              <Typography
                level="body-sm"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Keep up the good work!
              </Typography>
              <Button
                size="sm"
                variant="plain"
                endDecorator={<KeyboardArrowRightRounded />}
              >
                View Details
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </Card>
  );
};

export default CardWelcome;
