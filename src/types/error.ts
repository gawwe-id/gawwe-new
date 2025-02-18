import { StatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  constructor(
    public statusCode: StatusCode,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}
