import DasbhboardLayout from "@/layout/DashboardLayout";
import ClassDetail from "@/views/class-setting/class-detail";

export default async function ClassDetailPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <DasbhboardLayout locale={locale}>
      <ClassDetail />
    </DasbhboardLayout>
  );
}
