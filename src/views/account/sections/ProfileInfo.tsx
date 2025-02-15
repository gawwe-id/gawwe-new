'use client';

import { useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Divider,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Option,
  Select,
  Stack,
  Typography
} from '@mui/joy';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';

// import
import { client } from '@/lib/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@/hooks/useSnackbar';

// assets
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';

// types
import { ProfileParticipant } from '@/server/db/schema/profileParticipants';

const ProfileInfo = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<ProfileParticipant>({
    defaultValues: {
      phone: '',
      gender: '',
      birthDate: new Date(),
      educationLevelId: ''
    }
  });

  const { data: profile, isPending } = useQuery({
    queryKey: ['profile-participant'],
    queryFn: async () => {
      const res = await client.profileParticipants.single.$get();
      return (await res.json()).data;
    }
  });

  console.log('watch brthdate : ', watch('birthDate'));
  console.log(').format( : ', dayjs('13-03-2003').format('yyy-MMM-dd'));

  useEffect(() => {
    if (profile) {
      console.log('Proffffe : ', profile);

      reset({
        phone: profile.phone,
        gender: profile.gender,
        birthDate: new Date(profile?.birthDate),
        educationLevelId: profile.educationLevelId
      });
    }
  }, [profile, isPending]);

  const { data: educations } = useQuery({
    queryKey: ['educations'],
    queryFn: async () => {
      const res = await client.educationLevels.list.$get();
      return await res.json();
    }
  });

  const { mutate: mutateUpdateParticipant, isPending: isParticipant } =
    useMutation({
      mutationFn: async ({
        updateProfile,
        id
      }: {
        updateProfile: Partial<ProfileParticipant>;
        id: string;
      }) => {
        // Convert date format before sending to server
        // const formattedProfile = {
        //   ...updateProfile,
        //   birthDate: updateProfile.birthDate
        //     ? dayjs(updateProfile.birthDate).format('DD-MM-YYYY')
        //     : ''
        // };

        const res = await client.profileParticipants.update.$post({
          id: '',
          updateProfile: updateProfile
        });
        return await res.json();
      },
      onSuccess: async ({ data }) => {
        await queryClient.invalidateQueries({ queryKey: ['user'] });
        showSnackbar('User Profile berhasil diubah!', 'success');

        const formattedDate = data?.birthDate
          ? dayjs(data.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
          : '';

        reset({
          phone: data?.phone,
          gender: data?.gender,
          birthDate: new Date(formattedDate),
          educationLevelId: data?.educationLevelId
        });
      }
    });

  const onSubmit: SubmitHandler<ProfileParticipant> = (data) => {
    mutateUpdateParticipant({
      id: profile?.id as string,
      updateProfile: data
    });
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">Profile</Typography>
        <Typography level="body-sm">
          Write a short introduction to be displayed on your profile
        </Typography>
      </Box>
      <Divider />
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
                  // const selected = dayjs(value);
                  return (
                    <DatePicker
                      onChange={field.onChange}
                      selected={new Date(field.value)}
                      // onChange={(date: Date) => onChange(date)}
                      // value={value}
                      dateFormat="yyyy-MM-dd"
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
          >
            Batalkan
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="soft"
            type="submit"
            disabled={isParticipant}
            loading={isParticipant}
            endDecorator={<NavigateNextRoundedIcon />}
          >
            Selanjutnya
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default ProfileInfo;
