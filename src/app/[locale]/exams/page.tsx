import { Suspense } from "react";
import DasbhboardLayout from "@/layout/DashboardLayout";
import ExamsView from "@/views/exams";
import { CircularProgress } from "@mui/joy";

export default async function ExamsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <DasbhboardLayout locale={locale}>
      <Suspense fallback={<CircularProgress />}>
        <ExamsView />
      </Suspense>
    </DasbhboardLayout>
  );
}
