'use client';

import React from 'react';
import {
  Box,
  Button,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Option,
  Select,
  Stack
} from '@mui/joy';

//thrd party
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';

// import
import { useOnboardingStore } from '@/store/useOnboardingStore';
import { ProfileParticipant } from '@/server/db/schema/profileParticipants';
import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/client';

// assets
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

//types

const customStyles = `
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

const range = (start: number, end: number, step: number = 1): number[] => {
  const length = Math.floor((end - start) / step) + 1;
  return Array.from({ length }, (_, i) => start + i * step);
};

interface StepperDataParticipantProps {
  handleBack: () => void;
  handleNext: () => void;
}

const StepperDataParticipant = ({
  handleBack,
  handleNext
}: StepperDataParticipantProps) => {
  const participant = useOnboardingStore((state) => state.profileParticipant);
  const setProfileParticipant = useOnboardingStore(
    (state) => state.setProfileParticipant
  );

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

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<ProfileParticipant>({
    defaultValues: {
      phone: participant?.phone || '',
      gender: participant?.gender || '',
      birthDate: participant?.birthDate || new Date(),
      educationLevelId: participant?.educationLevelId || ''
    }
  });

  const { data: educations } = useQuery({
    queryKey: ['educations'],
    queryFn: async () => {
      const res = await client.educationLevels.list.$get();
      return await res.json();
    }
  });

  const customHeader = ({
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

  const onSubmit: SubmitHandler<ProfileParticipant> = (data) => {
    setProfileParticipant(data);
    handleNext();
  };

  return (
    <Box mt={4} width={'50%'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={6}>
            <Stack spacing={1}>
              <FormLabel>Nomor HP</FormLabel>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'No HP harus diisi',
                  pattern: {
                    value: /^[0-9]{10,14}$/,
                    message: 'No HP harus berupa angka dan minimal 10 digit'
                  }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phone"
                    type="tel"
                    size="sm"
                    fullWidth
                    value={field.value || ''}
                  />
                )}
              />
            </Stack>
            {errors.phone && (
              <FormHelperText
                sx={{ color: 'red', fontSize: 12, mt: 1 }}
                id="helper-text-phone"
              >
                * {errors?.phone?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid xs={6}>
            <Stack spacing={1}>
              <FormLabel>Jenis Kelamin</FormLabel>
              <Controller
                name="gender"
                control={control}
                rules={{
                  required: 'Jenis Kelamin harus dipilih'
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="sm"
                    placeholder="Pilih Jenis Kelamin"
                    value={field.value || ''}
                    onChange={(_, newValue) => field.onChange(newValue)}
                  >
                    <Option value="L">Laki-laki</Option>
                    <Option value="P">Perempuan</Option>
                  </Select>
                )}
              />
            </Stack>
            {errors.gender && (
              <FormHelperText
                sx={{ color: 'red', fontSize: 12, mt: 1 }}
                id="helper-text-gender"
              >
                * {errors?.gender?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid xs={6}>
            <Stack spacing={1}>
              <FormLabel>Tanggal Lahir</FormLabel>
              <style>{customStyles}</style>
              <Controller
                name="birthDate"
                control={control}
                rules={{
                  required: 'Tanggal lahir harus diisi',
                  validate: {
                    notFuture: (value) => {
                      if (value && dayjs(value) > dayjs()) {
                        return 'Tanggal lahir tidak boleh lebih dari hari ini';
                      }
                      return true;
                    },
                    notTooOld: (value) => {
                      if (value && dayjs(value) < dayjs('1900-01-01')) {
                        return 'Tanggal lahir tidak valid';
                      }
                      return true;
                    }
                  }
                }}
                render={({ field }) => {
                  return (
                    <DatePicker
                      onChange={field.onChange}
                      selected={new Date(field.value)}
                      dateFormat="yyyy-MM-dd"
                      renderCustomHeader={customHeader}
                      placeholderText="Select date"
                      ref={field.ref}
                      customInput={
                        <Input
                          id="birthDate"
                          size="sm"
                          fullWidth
                          startDecorator={<CalendarMonthRounded />}
                        />
                      }
                    />
                  );
                }}
              />
            </Stack>
            {errors.birthDate && (
              <FormHelperText
                sx={{ color: 'red', fontSize: 12, mt: 1 }}
                id="helper-text-birthDate"
              >
                * {errors?.birthDate?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid xs={6}>
            <Stack spacing={1}>
              <FormLabel>Pendidikan</FormLabel>
              <Controller
                name="educationLevelId"
                control={control}
                rules={{
                  required: 'Pendidikan harus dipilih'
                }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    size="sm"
                    placeholder="Pilih Pendidikan"
                    value={value || ''}
                    onChange={(_, newValue) => onChange(newValue)}
                  >
                    {educations?.data?.map((education) => (
                      <Option key={education.id} value={education.id}>
                        {education.name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Stack>
            {errors.educationLevelId && (
              <FormHelperText
                sx={{ color: 'red', fontSize: 12, mt: 1 }}
                id="helper-text-educationLevelId"
              >
                * {errors?.educationLevelId?.message}
              </FormHelperText>
            )}
          </Grid>
        </Grid>

        <Stack
          mt={10}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            size="sm"
            color="neutral"
            variant="soft"
            startDecorator={<NavigateBeforeRoundedIcon />}
            onClick={handleBack}
          >
            Kembali
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="soft"
            type="submit"
            endDecorator={<NavigateNextRoundedIcon />}
          >
            Selanjutnya
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default StepperDataParticipant;
