import DasbhboardLayout from "@/layout/DashboardLayout";
import ClassSetting from "@/views/class-setting";

export default async function ClassSettingPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <DasbhboardLayout locale={locale}>
      <ClassSetting />
    </DasbhboardLayout>
  );
}
