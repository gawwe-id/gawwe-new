import SimpleLayout from "@/layout/SimpleLayout";
import SignIn from "@/views/auth/signin";

export default async function LoginPage() {
  return (
    <SimpleLayout>
      <SignIn />
    </SimpleLayout>
  );
}
