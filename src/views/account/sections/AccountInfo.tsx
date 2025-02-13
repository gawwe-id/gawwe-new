"use client"

import { useSnackbar } from "@/hooks/useSnackbar"
import { client } from "@/lib/client"
import { User } from "@/server/db/schema/users"
import EditRounded from "@mui/icons-material/EditRounded"
import { AspectRatio, Box, Button, Card, CardActions, CardOverflow, Divider, FormControl, FormLabel, IconButton, Input, Stack, Typography } from "@mui/joy"
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

interface FormValues {
  name: string;
  image: string
}

const AccountInfo = () => {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient()

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await client.users.single.$get()
      return await res.json()
    },
  })

  const { register, handleSubmit, formState: { isDirty }, reset } = useForm<FormValues>({
    defaultValues: {
      name: user?.data?.name || "",
      image: user?.data?.image || ""
    }
  });

  const { mutate: mutateUpdateUser, isPending: isUser } = useMutation({
    mutationFn: async ({
      updateUser,
      userId,
    }: {
      updateUser: Partial<User>;
      userId: string;
    }) => {
      const res = await client.users.update.$post({
        updateUser,
        userId,
      });
      return await res.json();
    },
    onSuccess: async ({ data }) => {
      await queryClient.invalidateQueries({ queryKey: ["user"] })
      showSnackbar("User Account berhasil diubah!", "success");
      reset({ name: data?.name as string, image: data?.image as string });
    }
  })

  const onSubmit = (data: FormValues) => {
    if (!user?.data?.id) return;

    mutateUpdateUser({
      updateUser: { name: data.name },
      userId: user.data.id
    });
  };

  const handleReset = () => {
    reset({
      name: user?.data?.name as string,
      image: user?.data?.image as string
    });
  };

  return (
    <Card>
      <Box sx={{ mb: 1 }}>
        <Typography level="title-md">Account Info</Typography>
        <Typography level="body-sm">
          Infromasi ini akan dilihat oleh pengguna lain, Kamu boleh mengubahnya sesuai dengan identitas.
        </Typography>
      </Box>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, md: 4 }}
          sx={{ my: 1 }}
        >
          <Stack
            direction="column"
            spacing={1}
            sx={{
              alignItems: { xs: 'center', md: 'flex-start' },
              position: 'relative',
              width: { xs: '100%', md: 'auto' }
            }}
          >
            <AspectRatio
              ratio="1"
              maxHeight={200}
              sx={{
                flex: 1,
                minWidth: 100,
                maxWidth: { xs: 200, md: 100 },
                borderRadius: '100%'
              }}
            >
              <img
                src={user?.data?.image as string}
                loading="lazy"
                alt=""
              />
            </AspectRatio>
            <IconButton
              aria-label="upload new picture"
              size="sm"
              variant="outlined"
              color="neutral"
              sx={{
                bgcolor: 'background.body',
                position: 'absolute',
                zIndex: 2,
                borderRadius: '50%',
                boxShadow: 'sm',
                right: { xs: '30%', md: '-10px' },
                bottom: { xs: '0', md: '30px' }
              }}
            >
              <EditRounded />
            </IconButton>
          </Stack>

          <Stack
            spacing={2}
            sx={{
              flexGrow: 1,
              width: { xs: '100%', md: 'auto' }
            }}
          >
            <Stack spacing={1}>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input
                  {...register("name")}
                  size="lg"
                  placeholder="Nama Lengkap"
                  sx={{ width: '100%' }}
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
              loading={isUser}
              disabled={!isDirty}
              type="submit"
            >
              Simpan
            </Button>
          </CardActions>
        </CardOverflow>
      </form>
    </Card>
  )
}

export default AccountInfo