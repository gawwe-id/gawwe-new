// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { AdapterUser } from "@auth/core/adapters";

// Definisikan interface untuk user data kita
interface IUser extends DefaultUser {
  role: string;
  profileCompletion: number;
}

declare module "next-auth" {
  interface Session {
    user: IUser & DefaultSession["user"];
  }

  interface User extends IUser {}
}

declare module "@auth/core/adapters" {
  interface AdapterUser extends IUser {}
}
