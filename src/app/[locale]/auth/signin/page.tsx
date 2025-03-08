import SimpleLayout from "@/layout/SimpleLayout";
import SignIn from "@/views/auth/signin";

export default async function LoginPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <SimpleLayout locale={locale}>
      <SignIn />
    </SimpleLayout>
  );
}
