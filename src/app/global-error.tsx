"use client";

import { Button, Box, Typography, Container } from "@mui/joy";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Container
            sx={{
              py: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography level="h1" sx={{ mb: 2 }}>
              Something went wrong!
            </Typography>

            <Typography sx={{ mb: 4, maxWidth: "600px", color: "#666" }}>
              We've encountered an unexpected error. Our team has been notified.
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                component={Link}
                href="/"
                size="lg"
                variant="solid"
                color="primary"
              >
                Go to Home Page
              </Button>
              <Button onClick={() => reset()} size="lg" variant="outlined">
                Try Again
              </Button>
            </Box>
          </Container>
        </Box>
      </body>
    </html>
  );
}
