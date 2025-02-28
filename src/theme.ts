"use client";

import { extendTheme } from "@mui/joy/styles";
import { inputClasses } from "@mui/joy/Input";

declare module "@mui/joy/styles" {
  interface Palette {
    secondary: PaletteRange;
  }
  interface PaletteRange {
    solidBg?: string;
    solidHoverBg?: string;
    solidActiveBg?: string;
  }
  interface ColorPalettePropOverrides {
    secondary: true;
  }
}

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
        secondary: {
          50: "#e6f4ff",
          100: "#bae0ff",
          200: "#91caff",
          300: "#69b1ff",
          400: "#4096ff",
          500: "#1677ff",
          600: "#0958d9",
          700: "#003eb3",
          800: "#002c8c",
          900: "#001d66",
          // Solid variant
          solidBg: "var(--joy-palette-secondary-600)",
          solidHoverBg: "var(--joy-palette-secondary-500)",
          solidActiveBg: "var(--joy-palette-secondary-400)",
          solidColor: "#fff",

          // Soft variant
          softColor: "var(--joy-palette-secondary-700)",
          softBg: "var(--joy-palette-secondary-100)",
          softHoverBg: "var(--joy-palette-secondary-200)",
          softActiveBg: "var(--joy-palette-secondary-300)",

          // Outlined variant
          outlinedColor: "var(--joy-palette-secondary-500)",
          outlinedBorder: "var(--joy-palette-secondary-200)",
          outlinedHoverBg: "var(--joy-palette-secondary-50)",
          outlinedHoverBorder: "var(--joy-palette-secondary-300)",
          outlinedActiveBg: "var(--joy-palette-secondary-100)",

          // Plain variant
          plainColor: "var(--joy-palette-secondary-700)",
          plainHoverBg: "var(--joy-palette-secondary-50)",
          plainActiveBg: "var(--joy-palette-secondary-100)",
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
        secondary: {
          50: "#001d66",
          100: "#002c8c",
          200: "#003eb3",
          300: "#0958d9",
          400: "#1677ff",
          500: "#4096ff",
          600: "#69b1ff",
          700: "#91caff",
          800: "#bae0ff",
          900: "#e6f4ff",
          // Solid variant
          solidBg: "var(--joy-palette-secondary-700)",
          solidColor: "rgba(0, 0, 0, 0.87)",
          solidHoverBg: "var(--joy-palette-secondary-600)",
          solidActiveBg: "var(--joy-palette-secondary-400)",

          // Soft variant
          softColor: "var(--joy-palette-secondary-200)",
          softBg: "rgba(22, 119, 255, 0.16)",
          softHoverBg: "rgba(22, 119, 255, 0.24)",
          softActiveBg: "rgba(22, 119, 255, 0.32)",

          // Outlined variant
          outlinedColor: "var(--joy-palette-secondary-300)",
          outlinedBorder: "var(--joy-palette-secondary-700)",
          outlinedHoverBg: "rgba(22, 119, 255, 0.1)",
          outlinedHoverBorder: "var(--joy-palette-secondary-600)",
          outlinedActiveBg: "rgba(22, 119, 255, 0.2)",

          // Plain variant
          plainColor: "var(--joy-palette-secondary-300)",
          plainHoverBg: "rgba(22, 119, 255, 0.1)",
          plainActiveBg: "rgba(22, 119, 255, 0.2)",
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
});
