// "use client";

// ==============================|| ONBOARDING PAGE ||============================== //

import { Suspense } from "react";
import { AnimatedTextStaggered } from "@/components/AnimatedTextStaggered";
import SimpleFooter from "@/components/SimpleFooter";
import StepperWrapper from "./sections/StepperWrapper";
import { Box, Stack } from "@mui/joy";

export default function Onboarding() {
  return (
    <Box>
      <Stack justifyContent="center" alignItems="center">
        <AnimatedTextStaggered
          text={"Onboarding..."}
          el="h1"
          loop
          repeatDelay={1000}
        />
      </Stack>

      <Box my={10}>
        <Suspense>
          <StepperWrapper />
        </Suspense>
      </Box>

      <SimpleFooter />
    </Box>
  );
}
