import { Context } from "hono";
import { ZodError } from "zod";
import { DatabaseError } from "@neondatabase/serverless";
import { AppError } from "@/types/error";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const errorHandler = async (err: unknown, c: Context) => {
  // Handling Zod validation errors
  if (err instanceof ZodError) {
    return c.json(
      {
        status: "error",
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        errors: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      400
    );
  }

  // Handling custom AppError
  if (err instanceof AppError) {
    return c.json(
      {
        status: "error",
        code: err.code || "APP_ERROR",
        message: err.message,
      },
      err.statusCode as ContentfulStatusCode
    );
  }

  // Handling Database errors
  if (err instanceof DatabaseError) {
    // Handle specific database errors
    switch (err.code) {
      case "23505": // Unique violation
        return c.json(
          {
            status: "error",
            code: "DUPLICATE_ENTRY",
            message: "A record with this data already exists",
          },
          409
        );

      case "23503": // Foreign key violation
        return c.json(
          {
            status: "error",
            code: "FOREIGN_KEY_VIOLATION",
            message: "Referenced record does not exist",
          },
          400
        );

      default:
        // Log the database error for debugging
        console.error("Database error:", err);
        return c.json(
          {
            status: "error",
            code: "DATABASE_ERROR",
            message: "An error occurred while processing your request",
          },
          500
        );
    }
  }

  // Default error handler for unknown errors
  console.error("Unhandled error:", err);
  return c.json(
    {
      status: "error",
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
    500
  );
};
