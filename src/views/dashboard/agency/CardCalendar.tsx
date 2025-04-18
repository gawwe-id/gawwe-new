"use client";

import { Button, Card, CardContent, Typography } from "@mui/joy";
import { useColorScheme } from "@mui/joy/styles";
import { useMemo } from "react";
import DatePicker from "react-datepicker";

const CardCalendar = () => {
  const { mode } = useColorScheme();
  const isDarkMode = mode === "dark";

  const customStyles = useMemo(
    () => `
    .react-datepicker {
      width: 100%;
      font-family: var(--joy-fontFamily-body);
      border: 1px solid var(--joy-palette-neutral-outlinedBorder);
      border-radius: var(--joy-radius-sm);
      background-color: ${
        isDarkMode
          ? "var(--joy-palette-background-surface)"
          : "var(--joy-palette-background-body)"
      };
    }
    .react-datepicker__month-container {
      width: 100%;
      float: none;
    }
    .react-datepicker__month {
      margin: 0;
      padding: 0.5rem;
    }
    .react-datepicker__week {
      display: flex;
      justify-content: space-between;
    }
    .react-datepicker__day-names {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .react-datepicker__day-name {
      color: ${
        isDarkMode
          ? "var(--joy-palette-text-secondary)"
          : "var(--joy-palette-text-tertiary)"
      };
    }
    .react-datepicker__header {
      background-color: ${
        isDarkMode
          ? "var(--joy-palette-background-level1)"
          : "var(--joy-palette-background-level1)"
      };
      border-bottom: 1px solid var(--joy-palette-neutral-outlinedBorder);
      padding: 0.5rem;
    }
    .react-datepicker__current-month {
      color: ${
        isDarkMode
          ? "var(--joy-palette-text-primary)"
          : "var(--joy-palette-text-primary)"
      };
    }
    .react-datepicker__day {
      color: ${
        isDarkMode
          ? "var(--joy-palette-text-primary)"
          : "var(--joy-palette-text-primary)"
      };
      border-radius: var(--joy-radius-sm);
      margin: 0;
      padding: 0.5rem;
      width: 14.28%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
    .react-datepicker__day:hover {
      background-color: var(--joy-palette-primary-softBg);
    }
    .react-datepicker__day--selected {
      background-color: var(--joy-palette-primary-500);
      color: white;
    }
    .react-datepicker__day--keyboard-selected {
      background-color: var(--joy-palette-primary-300);
      color: ${
        isDarkMode
          ? "var(--joy-palette-common-white)"
          : "var(--joy-palette-common-black)"
      };
    }
    .react-datepicker__day--disabled {
      color: ${
        isDarkMode
          ? "var(--joy-palette-text-disabled)"
          : "var(--joy-palette-text-tertiary)"
      };
    }
    .react-datepicker__navigation-icon::before {
      border-color: ${
        isDarkMode
          ? "var(--joy-palette-text-secondary)"
          : "var(--joy-palette-text-primary)"
      };
    }
    .react-datepicker__navigation:hover *::before {
      border-color: var(--joy-palette-primary-main);
    }
  `,
    [isDarkMode]
  );

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <style>{customStyles}</style>
      <CardContent>
        <Typography level="title-md">Jadwal</Typography>
        <Typography level="body-sm" sx={{ mb: 2 }}>
          Jangan lewatkan jadwal kelas Kamu dengan Peserta yang sudah terdaftar
        </Typography>
        <DatePicker
          //   onChange={field.onChange}
          selected={new Date()}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date"
          inline
        />
        <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
          Lihat Jadwal Lengkap
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardCalendar;
