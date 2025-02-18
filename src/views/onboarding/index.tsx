"use client";

// ==============================|| ONBOARDING PAGE ||============================== //

import { Suspense, useEffect } from "react";
import { AnimatedTextStaggered } from "@/components/AnimatedTextStaggered";
import SimpleFooter from "@/components/SimpleFooter";
import StepperWrapper from "./sections/StepperWrapper";
import { Box, Stack } from "@mui/joy";
import { useSession } from "next-auth/react";
import { useOnboardingState } from "@/store/useOnboardingState";

export default function Onboarding() {
  const { data: session } = useSession();
  const { setUser } = useOnboardingState();

  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, []);

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
