import DasbhboardLayout from "@/layout/DashboardLayout";
import Calendar from "@/views/calendar";

export default async function CalendarPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <DasbhboardLayout locale={locale}>
      <Calendar />
    </DasbhboardLayout>
  );
}
