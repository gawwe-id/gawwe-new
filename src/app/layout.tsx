import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Gawwe ID | Speak Fluent, Work Abroad",
  description:
    "Platform pelatihan bahasa asing dan sertifikasi untuk karier profesional di luar negeri.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider session={session}>
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
