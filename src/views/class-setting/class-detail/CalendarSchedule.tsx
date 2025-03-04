"use client";

import { useClassSchedules } from "@/hooks/useClassSchedule";
import { Class } from "@/server/db/schema/classes";
import { ClassCalendar, getHighlightDates } from "@/utils/classCalendarHelper";
import { useColorScheme } from "@mui/joy";
import { useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarScheduleProps {
  classData: Class | undefined;
}

const CalendarSchedule = ({ classData }: CalendarScheduleProps) => {
  const { mode } = useColorScheme();
  const isDarkMode = mode === "dark";

  const { data: schedules } = useClassSchedules(classData?.id as string);

  const combinie: ClassCalendar = {
    ...classData,
    schedules: schedules?.data || [],
  };

  const highlights = getHighlightDates(combinie);

  const dayClassname = (date: Date) => {
    const isHighlighted = highlights.some(
      (d) => d.toDateString() === date.toDateString()
    );

    // Return different classes based on the day of the week
    if (isHighlighted) {
      const dayOfWeek = date.getDay();
      // Monday (1) highlights in green, Wednesday (3) highlights in orange
      return dayOfWeek === 1 ? "monday-highlight" : "wednesday-highlight";
    }
    return "";
  };

  const customStyles = useMemo(
    () => `
      /* Calendar container */
      .react-datepicker {
        width: 100%;
        font-family: var(--joy-fontFamily-body);
        border: 1px solid var(--joy-palette-neutral-outlinedBorder);
        border-radius: var(--joy-radius-md);
        background-color: ${
          isDarkMode
            ? "var(--joy-palette-background-level1)"
            : "var(--joy-palette-background-surface)"
        };
        padding: 0.75rem;
      }
      
      /* Month container */
      .react-datepicker__month-container {
        width: 100%;
        float: none;
      }
      
      /* Month header */
      .react-datepicker__header {
        background-color: transparent;
        border-bottom: 1px solid ${
          isDarkMode
            ? "var(--joy-palette-divider)"
            : "var(--joy-palette-neutral-200)"
        };
        padding: 0.75rem 0;
        margin-bottom: 0.5rem;
      }
      
      /* Current month text */
      .react-datepicker__current-month {
        color: var(--joy-palette-text-primary);
        font-family: var(--joy-fontFamily-display);
        font-weight: 600;
        font-size: 1.125rem;
        margin-bottom: 0.75rem;
      }
      
      /* Day names row */
      .react-datepicker__day-names {
        display: flex;
        justify-content: space-between;
        margin: 0.75rem 0 0.25rem;
      }
      
      /* Individual day name */
      .react-datepicker__day-name {
        color: var(--joy-palette-text-tertiary);
        font-weight: 500;
        width: 2.5rem;
        font-size: 0.85rem;
        margin: 0;
      }
      
      /* Week row */
      .react-datepicker__week {
        display: flex;
        justify-content: space-between;
        margin: 0.25rem 0;
      }
      
      /* Base day styling */
      .react-datepicker__day {
        margin: 0;
        width: 2.5rem;
        height: 2.5rem;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: var(--joy-radius-sm);
        font-size: 0.9rem;
        color: var(--joy-palette-text-primary);
        transition: all 0.2s ease;
        position: relative;
      }
      
      /* Hover effect */
      .react-datepicker__day:hover:not(.react-datepicker__day--selected):not(.react-datepicker__day--disabled) {
        background-color: ${
          isDarkMode
            ? "var(--joy-palette-neutral-700)"
            : "var(--joy-palette-neutral-100)"
        };
      }
      
      /* Selected day */
      .react-datepicker__day--selected {
        background-color: var(--joy-palette-primary-500);
        color: white;
        font-weight: 600;
      }
      
      /* Keyboard selected */
      .react-datepicker__day--keyboard-selected {
        background-color: var(--joy-palette-primary-200);
        color: var(--joy-palette-primary-800);
      }
      
      /* Today */
      .react-datepicker__day--today {
        font-weight: 600;
        border: 1px solid var(--joy-palette-primary-300);
      }
      
      /* Disabled days */
      .react-datepicker__day--disabled {
        color: ${
          isDarkMode
            ? "var(--joy-palette-neutral-600)"
            : "var(--joy-palette-neutral-400)"
        };
        opacity: 0.6;
      }
      
      /* Outside month */
      .react-datepicker__day--outside-month {
        color: ${
          isDarkMode
            ? "var(--joy-palette-neutral-500)"
            : "var(--joy-palette-neutral-400)"
        };
        opacity: 0.7;
      }
      
      /* Navigation */
      .react-datepicker__navigation {
        top: 1rem;
      }
      
      .react-datepicker__navigation-icon::before {
        border-color: var(--joy-palette-text-secondary);
        border-width: 2px 2px 0 0;
        height: 8px;
        width: 8px;
      }
      
      .react-datepicker__navigation:hover *::before {
        border-color: var(--joy-palette-primary-500);
      }
      
      /* Highlight styles */
      .monday-highlight {
        background-color: ${
          isDarkMode
            ? "var(--joy-palette-success-700)"
            : "var(--joy-palette-success-100)"
        };
        color: ${
          isDarkMode
            ? "var(--joy-palette-success-100)"
            : "var(--joy-palette-success-800)"
        };
        position: relative;
      }
      
      .monday-highlight::after {
        content: '';
        position: absolute;
        bottom: 7px;
        width: 20px;
        height: 3px;
        background-color: var(--joy-palette-success-500);
        border-radius: 1.5px;
      }
      
      .wednesday-highlight {
        background-color: ${
          isDarkMode
            ? "var(--joy-palette-warning-700)"
            : "var(--joy-palette-warning-100)"
        };
        color: ${
          isDarkMode
            ? "var(--joy-palette-warning-100)"
            : "var(--joy-palette-warning-800)"
        };
        position: relative;
      }
      
      .wednesday-highlight::after {
        content: '';
        position: absolute;
        bottom: 7px;
        width: 20px;
        height: 3px;
        background-color: var(--joy-palette-warning-500);
        border-radius: 1.5px;
      }
      
      /* Selected highlights */
      .monday-highlight.react-datepicker__day--selected, 
      .wednesday-highlight.react-datepicker__day--selected {
        background-color: var(--joy-palette-primary-500);
        color: white;
      }
      
      .monday-highlight.react-datepicker__day--selected::after,
      .wednesday-highlight.react-datepicker__day--selected::after {
        background-color: white;
      }
    `,
    [isDarkMode]
  );

  return (
    <>
      <style>{customStyles}</style>
      <DatePicker
        selected={new Date()}
        highlightDates={highlights || []}
        dayClassName={dayClassname}
        isClearable
        inline
      />
    </>
  );
};

export default CalendarSchedule;
