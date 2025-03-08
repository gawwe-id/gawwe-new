// project import
import SimpleLayout from "@/layout/SimpleLayout";
import Landing from "@/views/landing";

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <SimpleLayout locale={locale}>
      <Landing />
    </SimpleLayout>
  );
}
