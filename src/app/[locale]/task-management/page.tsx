import DasbhboardLayout from "@/layout/DashboardLayout";
import TaskManagement from "@/views/task-management";

export default async function TaskManagementPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <DasbhboardLayout locale={locale}>
      <TaskManagement />
    </DasbhboardLayout>
  );
}
