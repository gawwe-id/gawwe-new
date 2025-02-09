import { Resend } from "resend";
// import { config } from "dotenv";

// config({ path: ".env" });

// export const resend = new Resend("re_XaSFUeFK_LvLN2fRmEtwSrXkgGqA1f9Xb");
export const resend = new Resend(process.env.RESEND_API_KEY);
