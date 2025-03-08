// import project
import DasbhboardLayout from "@/layout/DashboardLayout";
import Account from "@/views/account";
import DialogEditAddress from "@/views/account/settings/DialogEditAddress";

export default async function AccountPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <DasbhboardLayout locale={locale}>
      <Account />
      <DialogEditAddress />
    </DasbhboardLayout>
  );
}
