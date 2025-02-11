"use client";

import React, { ReactNode, useState } from "react";

import { Box, Button, Stack } from "@mui/joy";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

// project import
import StepperRole from "./stepper-item/StepperRole";
import StepperFullname from "./stepper-item/StepperFullname";
import StepperUploadImage from "./stepper-item/StepperUploadImage";
import StepperDataParticipant from "./stepper-item/StepperDataParticipant";
import StepperDataAgency from "./stepper-item/StepperDataAgency";
import StepperAddressParticipant from "./stepper-item/StepperAddressParticipant";
import StepperSummary from "./stepper-item/StepperSummary";
import StepperAddressAgency from "./stepper-item/StepperAddressAgency";
import StepperContent from "./StepperContent";

interface StepWrapperProps {
  children: ReactNode;
  value: number;
  index: number;
}

function StepWrapper({ children, value, index, ...other }: StepWrapperProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{ p: 3 }}
          minHeight={300}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {children}
        </Box>
      )}
    </div>
  );
}

type IconType = "admin" | "name" | "photo" | "data" | "address" | "summary";

// Types
type Steps = {
  name: string;
  iconType: IconType;
};

const StepperWrapper = () => {
  const steps: Steps[] = [
    {
      name: "Role",
      iconType: "admin",
    },
    {
      name: "Nama Lengkap",
      iconType: "name",
    },
    {
      name: "Foto Profil",
      iconType: "photo",
    },
    {
      name: "Data Pribadi",
      iconType: "data",
    },
    {
      name: "Alamat",
      iconType: "address",
    },
    {
      name: "Rangkuman",
      iconType: "summary",
    },
  ];

  const user = useOnboardingStore((state) => state.user);
  // const agency = useOnboardingStore((state) => state.profileAgency);
  // const participant = useOnboardingStore((state) => state.profileParticipant);

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await client.roles.list.$get();
      return await res.json();
    },
  });

  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
      <StepperContent steps={steps} activeStep={activeStep} />
      {activeStep === steps.length ? (
        <>
          <Stack>
            <Button onClick={handleReset} color="danger" variant="soft">
              Reset
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <StepWrapper value={activeStep} index={0}>
            <StepperRole roles={roles?.data} handleNext={handleNext} />
          </StepWrapper>
          <StepWrapper value={activeStep} index={1}>
            <StepperFullname handleNext={handleNext} handleBack={handleBack} />
          </StepWrapper>
          <StepWrapper value={activeStep} index={2}>
            <StepperUploadImage
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </StepWrapper>
          <StepWrapper value={activeStep} index={3}>
            {user?.role === "participant" && (
              <StepperDataParticipant
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
            {user?.role === "agency" && (
              <StepperDataAgency
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
          </StepWrapper>
          <StepWrapper value={activeStep} index={4}>
            {user?.role === "participant" && (
              <StepperAddressParticipant
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
            {user?.role === "agency" && (
              <StepperAddressAgency
                handleNext={handleNext}
                handleBack={handleBack}
              />
            )}
          </StepWrapper>
          <StepWrapper value={activeStep} index={5}>
            <StepperSummary handleBack={handleBack} />
          </StepWrapper>
        </>
      )}
    </div>
  );
};

export default StepperWrapper;
