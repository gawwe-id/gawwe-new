import { lazy, ReactNode } from "react";

// joy-ui
import { Box } from "@mui/joy";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DialogAlert from "@/components/dialog/DialogAlert";

// project import
const Sidebar = lazy(() => import("./Sidebar/index"));
const Header = lazy(() => import("./Header/index"));

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session?.user) {
    if (session.user.profileCompletion === 0) {
      redirect("/onboarding");
    }
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Sidebar />
      <Header />
      <Box
        component="main"
        className="MainContent"
        sx={{
          pt: { xs: "calc(12px + var(--Header-height))", md: 3 },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100dvh",
          gap: 1,
          overflow: "auto",
        }}
      >
        {children}
      </Box>

      <DialogAlert />
    </Box>
  );
}
