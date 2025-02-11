"use client";

// joy-ui
import { Avatar, Box, IconButton, Typography } from "@mui/joy";

// import project
import { signOut, useSession } from "next-auth/react";
import { useDialogAlertStore } from "@/store/useDialogAlertStore";

// assets
import { LogoutRounded } from "@mui/icons-material";

const UserDisplay = () => {
  const { data: session } = useSession();
  const { openDialog, setLoading } = useDialogAlertStore();

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  const handleOpenDialog = () => {
    openDialog({
      title: "Konfirmasi Keluar",
      description: "Apakah Anda yakin ingin keluar?",
      textCancel: "Batal",
      textAction: "Keluar",
      onAction: handleSignOut,
    });
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Avatar variant="outlined" size="sm" src={session?.user?.image ?? ""} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography level="title-sm">
          <Typography level="title-sm">{session?.user?.name}</Typography>
        </Typography>
        <Typography level="body-xs">{session?.user?.email}</Typography>
      </Box>
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        onClick={handleOpenDialog}
      >
        <LogoutRounded />
      </IconButton>
    </Box>
  );
};

export default UserDisplay;
