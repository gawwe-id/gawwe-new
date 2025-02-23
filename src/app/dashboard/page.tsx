import DasbhboardLayout from "@/layout/DashboardLayout";
import { auth } from "@/lib/auth";
import DashboardAgency from "@/views/dashboard/agency";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <DasbhboardLayout>
      {session?.user.role === "agency" ? (
        <DashboardAgency />
      ) : (
        <h2>HHEHE PARTICIPANT</h2>
      )}
    </DasbhboardLayout>
  );
}
