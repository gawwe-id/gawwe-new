import { auth, signIn, signOut } from "@/lib/auth";
import { RecentPost } from "./components/post";
import { Button, Input } from "@mui/joy";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex-col items-center justify-center relative isolate">
      <div className="absolute inset-0 -z-10 opacity-50 mix-blend-soft-light bg-[url('/noise.svg')] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
        <h1>
          <span>JStack</span>
        </h1>

        <p className="text-[#ececf399] text-lg/7 md:text-xl/8 text-pretty sm:text-wrap sm:text-center text-center mb-8">
          The stack for building seriously fast, lightweight and{" "}
          <span className="inline sm:block">
            end-to-end typesafe Next.js apps.
          </span>
        </p>

        <RecentPost />

        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit">Signin with Google</button>
        </form>

        <br />
        <br />
        <br />

        {/* <form
              action={async (formData) => {
                "use server";
                await signIn("resend", formData);
              }}
            >
              <input type="text" name="email" placeholder="Email" />
              <button type="submit">Signin with Resend</button>
            </form> */}

        <form
          action={async (formData) => {
            "use server";
            await signIn("resend", formData);
          }}
        >
          <Input type="email" name="email" placeholder="Email" size="lg" />
          <Button type="submit" size="lg" variant="soft" color="primary">
            Signin with Resend
          </Button>
        </form>
      </div>
    </main>
  );
}
