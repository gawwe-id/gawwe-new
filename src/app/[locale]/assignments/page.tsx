import DasbhboardLayout from "@/layout/DashboardLayout";
import Assignments from "@/views/assignments";

export default async function AssignmentsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <DasbhboardLayout locale={locale}>
      <Assignments />
    </DasbhboardLayout>
  );
}
