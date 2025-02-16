'use client';

import { useSnackbar } from '@/hooks/useSnackbar';
import { client } from '@/lib/client';
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardActions,
  CardOverflow,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Stack,
  Typography
} from '@mui/joy';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

// assets
import EditRounded from '@mui/icons-material/EditRounded';

// hooks
import { useUploadFile } from '@/hooks/useUploadFile';
import { useUpdateFile } from '@/hooks/useUpdateFile';

// types
import { User } from '@/server/db/schema/users';

interface FormValues {
  name: string;
}

const AccountInfo = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await client.users.single.$get();
      return await res.json();
    }
  });

  const {
    setValue,
    register,
    handleSubmit,
    formState: { isDirty },
    reset
  } = useForm<FormValues>({
    defaultValues: {
      name: user?.data?.name || ''
    }
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.data?.name as string);
    }
  }, [user, setValue]);

  const { mutate: mutateUpdateUser, isPending: isUser } = useMutation({
    mutationFn: async ({
      updateUser,
      userId
    }: {
      updateUser: Partial<User>;
      userId: string;
    }) => {
      const res = await client.users.update.$post({
        updateUser,
        userId
      });
      return await res.json();
    },
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      showSnackbar('User Account berhasil diubah!', 'success');
      reset({ name: data?.name as string });
    }
  });

  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();
  const { mutate: updateFile, isPending: isUpdating } = useUpdateFile();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const getImageKeyFromUrl = (url: string) => {
    // Extract the key from the URL (everything after gawwe.space/)
    return url.split('gawwe.space/')[1];
  };

  const generateUniqueFileName = (file: File) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uniqueFileName = generateUniqueFileName(file);
    const updatedImage = `https://gawwe.space/${uniqueFileName}`;

    const newFile = new File([file], uniqueFileName, {
      type: file.type
    });

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showSnackbar(
        'Mohon upload tipe file yang valid (JPEG, PNG, or WebP)',
        'danger'
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showSnackbar('Ukuran gambar harus dibawah 5MB', 'danger');
      return;
    }

    const handleSuccess = (response: any) => {
      if (!user?.data?.id) return;

      mutateUpdateUser({
        updateUser: { image: updatedImage },
        userId: user.data.id
      });
      showSnackbar('Profile picture berhasil diubah!', 'success');
    };

    const handleError = () => {
      showSnackbar('Gagal upload image. Coba lagi.', 'danger');
    };

    if (user?.data?.image) {
      const existingImageKey = getImageKeyFromUrl(user.data.image);

      updateFile(
        { file: newFile, key: existingImageKey as string },
        {
          onSuccess: handleSuccess,
          onError: handleError
        }
      );
    } else {
      uploadFile(newFile, {
        onSuccess: handleSuccess,
        onError: handleError
      });
    }
  };

  const onSubmit = (data: FormValues) => {
    if (!user?.data?.id) return;

    mutateUpdateUser({
      updateUser: { name: data.name },
      userId: user.data.id
    });
  };

  const handleReset = () => {
    reset({
      name: user?.data?.name as string
    });
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">Account</Typography>
        <Typography level="body-sm">Sesuaikan dengan identitas kamu</Typography>
      </Box>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction={{ xs: 'column' }} spacing={{ xs: 2 }} sx={{ my: 3 }}>
          <Stack
            direction="column"
            spacing={1}
            sx={{
              alignItems: { xs: 'center' },
              position: 'relative',
              width: { xs: '100%' }
            }}
          >
            <AspectRatio
              ratio="1"
              maxHeight={200}
              sx={{
                flex: 1,
                minWidth: 100,
                maxWidth: { xs: 200 },
                borderRadius: '100%'
              }}
            >
              <img
                src={user?.data?.image || '/default-avatar.png'}
                loading="lazy"
                alt="Profile picture"
              />
            </AspectRatio>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />
            <IconButton
              aria-label="upload new picture"
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={handleImageClick}
              disabled={isUploading || isUpdating}
              sx={{
                bgcolor: 'background.body',
                position: 'absolute',
                zIndex: 2,
                borderRadius: '50%',
                boxShadow: 'sm',
                right: { xs: '30%' },
                bottom: { xs: '0' }
              }}
            >
              <EditRounded />
            </IconButton>
          </Stack>

          <Stack
            spacing={2}
            sx={{
              flexGrow: 1,
              width: { xs: '100%' }
            }}
          >
            <Stack spacing={1}>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input
                  {...register('name')}
                  size="sm"
                  placeholder="Nama Lengkap"
                  fullWidth
                />
              </FormControl>
            </Stack>
          </Stack>
        </Stack>

        <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              disabled={!isDirty}
              onClick={handleReset}
              type="button"
            >
              Batalkan
            </Button>
            <Button
              size="sm"
              variant="soft"
              loading={isUser || isUploading || isUpdating}
              disabled={!isDirty}
              type="submit"
            >
              Simpan
            </Button>
          </CardActions>
        </CardOverflow>
      </form>
    </Card>
  );
};

export default AccountInfo;
