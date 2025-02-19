import DasbhboardLayout from "@/layout/DashboardLayout";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <DasbhboardLayout>
      {session?.user.role === "agency" ? (
        <h2>HHAHA AGENCY</h2>
      ) : (
        <h2>HHEHE PARTICIPANT</h2>
      )}
    </DasbhboardLayout>
  );
}
