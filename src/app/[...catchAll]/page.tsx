import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "@/lib/i18n";
import { Box, Container, Typography } from "@mui/joy";
import { Suspense } from "react";
import NotFoundContent from "../not-found";

// Loading fallback component
function LoadingFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.surface",
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography level="h1">Loading...</Typography>
      </Container>
    </Box>
  );
}

export default async function CatchAll({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { resources } = await initTranslations(locale, ["notFound"]);

  return (
    <TranslationsProvider
      locale={locale}
      resources={resources}
      namespaces={["notFound"]}
    >
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundContent />
      </Suspense>
    </TranslationsProvider>
  );
}
