import { Suspense } from "react";
import DasbhboardLayout from "@/layout/DashboardLayout";
import { CircularProgress } from "@mui/joy";

export default async function MyClassesPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <DasbhboardLayout locale={locale}>
      <Suspense fallback={<CircularProgress />}></Suspense>
    </DasbhboardLayout>
  );
}
