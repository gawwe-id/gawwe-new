import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  Radio,
  radioClasses,
  RadioGroup,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import React from "react";

// assets
import {
  CheckCircleRounded,
  PeopleAltRounded,
  SchoolRounded,
} from "@mui/icons-material";

import { useOnboardingState } from "@/store/useOnboardingState";

// assets
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

// types
import { Role } from "@/server/db/schema/roles";

interface StepperRoleProps {
  roles: Role[] | undefined;
  isLoading: boolean;
  handleNext: () => void;
}

const StepperRole = ({ roles, isLoading, handleNext }: StepperRoleProps) => {
  const { updateUser, user } = useOnboardingState();

  const userRoles = roles?.filter((role) => role.code !== "admin");

  const [value, setValue] = React.useState<string | null>(user?.role ?? null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRole = (event.target as HTMLInputElement).value;
    setValue(newRole);
    updateUser({ role: newRole });
  };

  return (
    <Box mt={4}>
      <Typography textAlign="center" level="body-lg">
        Mendaftar Sebagai
      </Typography>
      {isLoading ? (
        <Stack
          mt={4}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress size="sm" />
        </Stack>
      ) : (
        <RadioGroup
          id="role"
          aria-label="role"
          value={value}
          onChange={handleChange}
          overlay
          name="role"
          sx={{
            mt: 2,
            flexDirection: "row",
            gap: 2,
            [`& .${radioClasses.checked}`]: {
              [`& .${radioClasses.action}`]: {
                inset: -1,
                border: "3px solid",
                borderColor: "primary.500",
              },
            },
            [`& .${radioClasses.radio}`]: {
              display: "contents",
              "& > svg": {
                zIndex: 2,
                position: "absolute",
                top: "-8px",
                right: "-8px",
                bgcolor: "background.surface",
                borderRadius: "50%",
              },
            },
          }}
        >
          {userRoles?.map((role) => {
            return (
              <Sheet
                key={role.id}
                variant="outlined"
                sx={{
                  borderRadius: "md",
                  boxShadow: "sm",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                  p: 2,
                  width: 120,
                }}
              >
                <Radio
                  id={role.id}
                  value={role.code}
                  checkedIcon={<CheckCircleRounded />}
                />
                {role.code === "agency" ? (
                  <SchoolRounded sx={{ fontSize: 24 }} />
                ) : (
                  <PeopleAltRounded sx={{ fontSize: 24 }} />
                )}
                <FormLabel htmlFor={role.code}>{role.name}</FormLabel>
              </Sheet>
            );
          })}
        </RadioGroup>
      )}

      <Stack
        mt={10}
        direction="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Button
          size="sm"
          color="primary"
          variant="soft"
          endDecorator={<NavigateNextRoundedIcon />}
          onClick={handleNext}
          disabled={!value}
        >
          Selanjutnya
        </Button>
      </Stack>
    </Box>
  );
};

export default StepperRole;
