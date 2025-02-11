// src/lib/resend.ts
import { Resend } from "resend";

const createResendClient = () => {
  if (typeof window !== "undefined") return null;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  return new Resend(process.env.RESEND_API_KEY);
};

export const resend = createResendClient();
