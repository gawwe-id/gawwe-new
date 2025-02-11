"use client";

import { Box, IconButton, Typography } from "@mui/joy";

// import project
import ColorSchemeToggle from "@/components/ColorSchemeToggle";

// assets
import {
  PeopleAltRounded,
  SchoolRounded,
  VerifiedUserRounded,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";

export default function TitleLogo() {
  const { data: session } = useSession();

  return (
    <Box mb={3} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <IconButton variant="soft" color="primary" size="sm">
        {session?.user?.role === "agency" ? (
          <SchoolRounded />
        ) : session?.user?.role === "admin" ? (
          <VerifiedUserRounded />
        ) : (
          <PeopleAltRounded />
        )}
      </IconButton>
      <Typography
        level="title-md"
        fontWeight="800"
        color="neutral"
        sx={{ textTransform: "capitalize" }}
      >
        {session?.user?.role}
      </Typography>
      <ColorSchemeToggle sx={{ ml: "auto" }} />
    </Box>
  );
}
