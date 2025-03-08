import TranslationsProvider from "@/components/TranslationsProvider";
import { auth } from "@/lib/auth";
import initTranslations from "@/lib/i18n";
import { redirect } from "next/navigation";
import { lazy, ReactNode } from "react";

// project-import
const Header = lazy(() => import("./Header"));

const i18nNamespaces = ["home"];

export default async function SimpleLayout({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const session = await auth();
  const { resources } = await initTranslations(locale, i18nNamespaces);

  if (session?.user) {
    if (session.user.profileCompletion === 0) {
      redirect("/onboarding");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <Header />
      {children}
    </TranslationsProvider>
  );
}
