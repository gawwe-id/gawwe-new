import { auth } from "@/lib/auth";
import { Container } from "@mui/joy";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user) {
    if (session.user.profileCompletion > 0) {
      redirect("/dashboard");
    }
  }

  return (
    <Container
      sx={{
        mt: 10,
      }}
    >
      {children}
    </Container>
  );
}
