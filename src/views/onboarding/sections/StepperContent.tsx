"use client";

import React from "react";
import {
  Step,
  StepIndicator,
  Stepper,
  Typography,
  typographyClasses,
} from "@mui/joy";

import { stepClasses } from "@mui/joy/Step";
import { stepIndicatorClasses } from "@mui/joy/StepIndicator";

// assets
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

type IconType = "admin" | "name" | "photo" | "data" | "address" | "summary";

type Steps = {
  name: string;
  iconType: IconType;
};

interface StepperOnboardingProps {
  steps: Steps[];
  activeStep: number;
}

interface StepIconProps {
  type: IconType;
}

const StepIcon = ({ type }: StepIconProps) => {
  switch (type) {
    case "admin":
      return <AdminPanelSettingsRoundedIcon />;
    case "name":
      return <DriveFileRenameOutlineRoundedIcon />;
    case "photo":
      return <AddPhotoAlternateRoundedIcon />;
    case "data":
      return <ManageAccountsRoundedIcon />;
    case "address":
      return <HomeRoundedIcon />;
    case "summary":
      return <InfoRoundedIcon />;
    default:
      return null;
  }
};

const StepperContent = ({ steps, activeStep }: StepperOnboardingProps) => {
  return (
    <Stepper
      size="lg"
      sx={(theme) => ({
        "--StepIndicator-size": "3rem",
        "--Step-gap": "1rem",
        "--Step-connectorRadius": "1rem",
        "--Step-connectorThickness": "4px",
        "--joy-palette-success-solidBg": "var(--joy-palette-success-400)",
        [`& .${stepClasses.completed}`]: {
          "&::after": { bgcolor: "success.solidBg" },
        },
        [`& .${stepClasses.active}`]: {
          [`& .${stepIndicatorClasses.root}`]: {
            border: "4px solid",
            borderColor: "#fff",
            boxShadow: `0 0 0 1px ${theme.vars.palette.primary[500]}`,
          },
        },
        [`& .${stepClasses.disabled} *`]: {
          color: "neutral.softDisabledColor",
        },
        [`& .${typographyClasses["title-sm"]}`]: {
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontSize: "10px",
        },
      })}
    >
      {steps.map((step, index) => {
        let isActive = activeStep === index;
        let isCompleted = activeStep > index;
        let isDisabled = activeStep < index;

        return (
          <Step
            key={index}
            orientation="vertical"
            active={isActive}
            completed={isCompleted}
            disabled={isDisabled}
            indicator={
              <StepIndicator
                variant={isActive || isCompleted ? "solid" : "outlined"}
                color={
                  isCompleted ? "success" : isDisabled ? "neutral" : "primary"
                }
              >
                {isCompleted ? (
                  <CheckRoundedIcon />
                ) : (
                  <StepIcon type={step.iconType} />
                )}
              </StepIndicator>
            }
          >
            <Typography
              level="body-lg"
              endDecorator={
                <Typography sx={{ fontSize: "sm", fontWeight: "normal" }}>
                  {step.name}
                </Typography>
              }
              sx={{
                fontWeight: "xl",
              }}
            >
              #{index + 1}{" "}
            </Typography>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default StepperContent;
