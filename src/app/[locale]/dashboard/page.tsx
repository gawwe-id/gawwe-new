import DasbhboardLayout from "@/layout/DashboardLayout";
import { auth } from "@/lib/auth";
import DashboardAgency from "@/views/dashboard/agency";
import DashboardParticipant from "@/views/dashboard/participant";

export default async function DashboardPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await props.params;

  return (
    <DasbhboardLayout locale={locale}>
      {session?.user.role === "agency" ? (
        <DashboardAgency />
      ) : (
        <DashboardParticipant />
      )}
    </DasbhboardLayout>
  );
}
