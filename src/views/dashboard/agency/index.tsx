import { Box, Grid } from "@mui/joy";

import CardWelcome from "./CardWelcome";
import CardStats from "./CardStats";
import CardRevenue from "./CardRevenue";
import CardTransactions from "./CardTransactions";
import CardCalendar from "./CardCalendar";
import CardAction from "./CardAction";

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
          <CardAction />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgencyDashboard;
