import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Providers } from "./providers";

import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

import i18nConfig from "../../../next-i18next.config";

export const metadata: Metadata = {
  title: "Gawwe ID | Speak Fluent, Work Abroad",
  description:
    "Platform pelatihan bahasa asing dan sertifikasi untuk karier profesional di luar negeri.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const session = await auth();
  const { locale } = await params;

  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang="id">
      <body className="antialiased">
        <SessionProvider session={session}>
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
