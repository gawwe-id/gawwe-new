import DashboardLayout from "@/layout/DashboardLayout";
import CreateClass from "@/views/class-setting/create";

export default async function CreateClassPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  return (
    <DashboardLayout locale={locale}>
      <CreateClass />
    </DashboardLayout>
  );
}
