import SimpleLayout from "@/layout/SimpleLayout";
import Error from "@/views/auth/error";

export default async function ErrorPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <SimpleLayout locale={locale}>
      <Error />
    </SimpleLayout>
  );
}
