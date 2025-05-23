import { lazy, ReactNode } from "react";

// joy-ui
import { Box } from "@mui/joy";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DialogAlert from "@/components/dialog/DialogAlert";
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "@/lib/i18n";

// project import
const Sidebar = lazy(() => import("./Sidebar/index"));
const Header = lazy(() => import("./Header/index"));

const i18nNamespaces = [
  "common",
  "dashboard",
  "account",
  "class",
  "schedules",
  "assignment",
  "exams",
];

export default async function DashboardLayout({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const session = await auth();
  const { resources } = await initTranslations(locale, i18nNamespaces);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session?.user) {
    if (session.user.profileCompletion === 0) {
      redirect("/onboarding");
    }
  }

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
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
          <Box sx={{ flex: 1, width: "100%" }}>
            <Box
              sx={{
                position: "sticky",
                top: { sm: -100, md: -110 },
                bgcolor: "background.body",
              }}
            >
              <Box sx={{ px: { xs: 2, md: 6 } }}>
                <DynamicBreadcrumbs
                  sx={{ mb: 2 }} // Optional additional styling
                />
                {children}
              </Box>
            </Box>
          </Box>
        </Box>
        <DialogAlert />
      </Box>
    </TranslationsProvider>
  );
}
