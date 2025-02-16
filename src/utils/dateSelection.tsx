import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { IconButton } from '@mui/joy';
import dayjs from 'dayjs';

const range = (start: number, end: number, step: number = 1): number[] => {
  const length = Math.floor((end - start) / step) + 1;
  return Array.from({ length }, (_, i) => start + i * step);
};

const years = range(1950, dayjs().year() + 1);
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const customStyles = `
  .react-datepicker {
    font-family: var(--joy-fontFamily-body);
    border: 1px solid var(--joy-palette-neutral-outlinedBorder);
    border-radius: var(--joy-radius-sm);
  }
  .react-datepicker__header {
    background-color: var(--joy-palette-background-level1);
    border-bottom: 1px solid var(--joy-palette-neutral-outlinedBorder);
  }
  .react-datepicker__day {
    color: var(--joy-palette-text-primary);
    border-radius: var(--joy-radius-sm);
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
  }
  .react-datepicker__day--disabled {
    color: var(--joy-palette-text-tertiary);
  }
`;

export const customHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled
}: {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}) => (
  <div
    style={{
      margin: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '8px'
    }}
  >
    <IconButton
      size="sm"
      variant="outlined"
      color="neutral"
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
    >
      <KeyboardArrowLeft />
    </IconButton>

    <div style={{ display: 'flex', gap: '8px' }}>
      <select
        value={dayjs(date).month()}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          changeMonth(Number(e.target.value));
        }}
        style={{
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid var(--joy-palette-neutral-outlinedBorder)',
          backgroundColor: 'var(--joy-palette-background-surface)',
          color: 'var(--joy-palette-text-primary)',
          fontSize: '0.875rem',
          cursor: 'pointer'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {months.map((month, idx) => (
          <option key={month} value={idx}>
            {month}
          </option>
        ))}
      </select>

      <select
        value={dayjs(date).year()}
        onChange={(e) => {
          e.preventDefault();
          e.stopPropagation();
          changeYear(Number(e.target.value));
        }}
        style={{
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid var(--joy-palette-neutral-outlinedBorder)',
          backgroundColor: 'var(--joy-palette-background-surface)',
          color: 'var(--joy-palette-text-primary)',
          fontSize: '0.875rem',
          cursor: 'pointer'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>

    <IconButton
      size="sm"
      variant="outlined"
      color="neutral"
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
    >
      <KeyboardArrowRight />
    </IconButton>
  </div>
);
