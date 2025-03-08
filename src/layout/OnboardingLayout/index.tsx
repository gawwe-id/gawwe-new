import TranslationsProvider from "@/components/TranslationsProvider";
import { auth } from "@/lib/auth";
import initTranslations from "@/lib/i18n";
import { Container } from "@mui/joy";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const i18nNamespaces = ["common", "onboarding"];

export default async function OnboardingLayout({
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

  if (session.user) {
    if (session.user.profileCompletion > 0) {
      redirect("/dashboard");
    }
  }

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <Container
        sx={{
          mt: 10,
        }}
      >
        {children}
      </Container>
    </TranslationsProvider>
  );
}
