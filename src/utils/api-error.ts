import { AppError } from "@/types/error";
import { StatusCode } from "hono/utils/http-status";

export const throwApiError = (
  statusCode: StatusCode,
  message: string,
  code?: string
) => {
  throw new AppError(statusCode, message, code);
};
