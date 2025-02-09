import { resend } from "@/lib/resend";
import { EmailConfig } from "@auth/core/providers";
import VerifyMagicLink from "./emails/VerifyMagicLink";

interface VerificationRequestParams {
  identifier: string;
  provider: EmailConfig;
  url: string;
}

export async function sendVerificationRequest(
  params: VerificationRequestParams
) {
  const { identifier, provider, url } = params;
  const { host } = new URL(url);

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to: [identifier],
      subject: `Login ke ${host}`,
      react: VerifyMagicLink({ host, url }),
    });

    return { success: true, data };
  } catch (error) {
    throw new Error("Gagal mengirim verifikasi email");
  }
}
