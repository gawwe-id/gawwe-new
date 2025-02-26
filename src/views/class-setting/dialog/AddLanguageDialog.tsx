"use client";

import { useEffect } from "react";
import {
  Modal,
  ModalDialog,
  Typography,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  FormHelperText,
  Divider,
} from "@mui/joy";
import { Language as LanguageIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { useSession } from "next-auth/react";
import { useSnackbar } from "@/hooks/useSnackbar";

// Define schema for form validation
const languageFormSchema = z.object({
  languageId: z.string().min(1, "Silakan pilih bahasa"),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "All Levels"]),
});

type LanguageFormValues = z.infer<typeof languageFormSchema>;

interface AddLanguageDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddLanguageDialog({
  open,
  onClose,
}: AddLanguageDialogProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageFormSchema),
    defaultValues: {
      languageId: "",
      level: "Beginner",
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset({
        languageId: "",
        level: "Beginner",
      });
    }
  }, [open, reset]);

  // Fetch available languages
  const { data: languages, isLoading: isLanguages } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const res = await client.languages.list.$get();
      return await res.json();
    },
  });

  // Setup mutation
  const { mutate: createLanguageClass, isPending } = useMutation({
    mutationFn: async (data: LanguageFormValues) => {
      const languageName = languages?.data?.find(
        (language) => language.id === data.languageId
      )?.name as string;

      const res = await client.languageClasses.create.$post({
        languageName,
        level: data.level,
        languageId: data.languageId,
        userId: session?.user.id as string,
      });
      return await res.json();
    },
    onSuccess: async (data) => {
      // Invalidate and refetch language classes
      await queryClient.invalidateQueries({
        queryKey: ["language-classes"],
      });
      showSnackbar(data.message, "success");
      onClose();
    },
    onError: (error) => {
      console.error("Error creating language class:", error);
      showSnackbar(error.message, "danger");
    },
  });

  const onSubmit = (data: LanguageFormValues) => {
    createLanguageClass(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              width: 60,
              height: 60,
              bgcolor: "primary.softBg",
              color: "primary.500",
              mb: 1,
            }}
          >
            <LanguageIcon sx={{ fontSize: 30 }} />
          </Box>

          <Typography
            component="h2"
            id="add-language-modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
          >
            Tambah Bahasa Baru
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl sx={{ mb: 2 }} required>
            <FormLabel>Nama Bahasa</FormLabel>
            <Controller
              name="languageId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="sm"
                  placeholder="Pilih Bahasa"
                  value={field.value || ""}
                  onChange={(event, newValue) => {
                    field.onChange(newValue);
                  }}
                >
                  {languages?.data?.map((language, index) => (
                    <Option key={index} value={language.id}>
                      {language.name}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.languageId && (
              <FormHelperText>{errors.languageId.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Level</FormLabel>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="sm"
                  onChange={(_, newValue) => {
                    field.onChange(newValue);
                  }}
                  sx={{ width: "100%" }}
                >
                  <Option value="Beginner">Beginner</Option>
                  <Option value="Intermediate">Intermediate</Option>
                  <Option value="Advanced">Advanced</Option>
                  <Option value="All Levels">All Levels</Option>
                </Select>
              )}
            />
            <FormHelperText>Pilih level umum untuk bahasa ini</FormHelperText>
          </FormControl>

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="plain" color="neutral" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" loading={isPending}>
              Simpan
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
