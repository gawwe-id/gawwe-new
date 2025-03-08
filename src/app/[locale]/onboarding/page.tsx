import OnboardingLayout from "@/layout/OnboardingLayout";
import Onboarding from "@/views/onboarding";

export default async function OnboardingPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <OnboardingLayout locale={locale}>
      <Onboarding />
    </OnboardingLayout>
  );
}
