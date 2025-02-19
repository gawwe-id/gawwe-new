import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { lazy, ReactNode } from "react";

// project-import
const Header = lazy(() => import("./Header"));

export default async function SimpleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (session?.user) {
    if (session.user.profileCompletion === 0) {
      redirect("/onboarding");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}
