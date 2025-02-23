import React from "react";
import {
  Box,
  Sheet,
  Stack,
  Typography,
  Avatar,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
} from "@mui/joy";

import CardWelcome from "./CardWelcome";
import CardStats from "./CardStats";
import CardRevenue from "./CardRevenue";
import CardTransactions from "./CardTransactions";
import CardCalendar from "./CardCalendar";

const AgencyDashboard = () => {
  return (
    <Box>
      <CardWelcome />

      <Grid container spacing={3}>
        <Grid xs={12} md={9}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <CardStats />
            <CardRevenue />
            <CardTransactions />
          </Box>
        </Grid>
        <Grid xs={12} md={3}>
          <CardCalendar />

          {/* Upcoming Meeting */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography level="title-md">Meeting</Typography>
              <Typography level="h4" sx={{ my: 1 }}>
                Upcoming Event Planning Discussion
              </Typography>
              <Typography level="body-sm" sx={{ mb: 2 }}>
                Don't miss the call for next year project team to date.
                manage...
              </Typography>
              <Typography level="body-sm">18th Oct 11:00 - 12:00</Typography>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                Meeting Zoom Link
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgencyDashboard;
