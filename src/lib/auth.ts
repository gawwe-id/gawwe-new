import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db";

import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { sendVerificationRequest } from "@/utils/sendVerificationRequest";

// providers
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          response_type: "code",
        },
      },
    }),
    Resend({
      from: process.env.EMAIL_FROM,
      server: process.env.EMAIL_SERVER_HOST,
      sendVerificationRequest({ identifier: email, url, provider }) {
        // your function
        sendVerificationRequest({ identifier: email, provider, url });
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.profileCompletion = user.profileCompletion;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileCompletion = user.profileCompletion;
      }
      return token;
    },
  },
  pages: {
    verifyRequest: "/auth/verify-request",
  },
});
