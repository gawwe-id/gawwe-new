// import project
import DasbhboardLayout from '@/layout/DashboardLayout';
import Account from '@/views/account';
import DialogEditAddress from '@/views/account/settings/DialogEditAddress';

export default async function AccountPage() {
  return (
    <DasbhboardLayout>
      <Account />
      <DialogEditAddress />
    </DasbhboardLayout>
  );
}
