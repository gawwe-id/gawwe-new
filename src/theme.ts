"use client"

import { extendTheme } from "@mui/joy/styles"
import { inputClasses } from "@mui/joy/Input"

export default extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#fff2e8",
          100: "#ffd8bf",
          200: "#ffbb96",
          300: "#ff9c6e",
          400: "#ff7a45",
          500: "#fa541c",
          600: "#d4380d",
          700: "#ad2102",
          800: "#871400",
          900: "#610b00",
          solidBg: "var(--joy-palette-primary-600)",
          solidHoverBg: "var(--joy-palette-primary-500)",
          solidActiveBg: "var(--joy-palette-primary-400)",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          50: "#2b1611",
          100: "#441d12",
          200: "#592716",
          300: "#7c3118",
          400: "#aa3e19",
          500: "#d84a1b",
          600: "#e87040",
          700: "#f3956a",
          800: "#f8b692",
          900: "#fad4bc",
          solidBg: "var(--joy-palette-primary-700)",
          solidColor: "var(--joy-palette-common-black)",
          solidHoverBg: "var(--joy-palette-primary-600)",
          solidActiveBg: "var(--joy-palette-primary-400)",
        },
        background: {
          body: "var(--joy-palette-common-black)",
          surface: "var(--joy-palette-neutral-900)",
        },
      },
    },
  },
  fontFamily: {
    display: "'Inter', var(--joy-fontFamily-fallback)",
    body: "'Inter', var(--joy-fontFamily-fallback)",
  },
  components: {
    JoyInput: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant === "outlined" && {
            [`&:not(.${inputClasses.focused}):hover::before`]: {
              boxShadow: `inset 0 0 0 2px ${
                theme.vars.palette?.[ownerState.color!]?.outlinedBorder
              }`,
            },
          }),
        }),
        input: {
          caretColor: "var(--Input-focusedHighlight)",
        },
      },
    },
  },
})
