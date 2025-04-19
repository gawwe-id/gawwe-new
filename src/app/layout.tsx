import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Providers } from "./[locale]/providers";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SessionProvider session={session}>
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  );
}

// import { ReactNode } from "react";

// export default async function RootLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return children;
// }
