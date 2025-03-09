import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "@/lib/i18n";
import VerifyRequestPage from "@/views/auth/verify-request";

const i18nNamespaces = ["common", "auth"];

export default async function VerifyRequest(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}
    >
      <VerifyRequestPage />
    </TranslationsProvider>
  );
}
