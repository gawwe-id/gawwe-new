"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { HTTPException } from "hono/http-exception";
import { PropsWithChildren, useState } from "react";

import { CssVarsProvider, StyledEngineProvider } from "@mui/joy/styles";
import { CssBaseline } from "@mui/joy";

import { Snackbar } from "@/components/Snackbar";

import theme from "@/theme";

import "react-datepicker/dist/react-datepicker.css";

export const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (err) => {
            if (err instanceof HTTPException) {
              // global error handling, e.g. toast notification ...
            }
          },
        }),
      })
  );

  return (
    <StyledEngineProvider injectFirst>
      <CssVarsProvider theme={theme} disableTransitionOnChange>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          {children}
          <Snackbar />
        </QueryClientProvider>
      </CssVarsProvider>
    </StyledEngineProvider>
  );
};
