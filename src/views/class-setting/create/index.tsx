"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// UI Components
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Alert,
  IconButton,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/joy";

import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CalendarMonth as CalendarIcon,
  School as SchoolIcon,
  Language as LanguageIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

// Types from schema
type ClassFormData = {
  name: string;
  description: string;
  schedule: string;
  languageClassId: string;
  batch: number;
  startDate: Date;
  endDate: Date;
};

export default function CreateClass() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const languageId = searchParams.get("languageId");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [languageData, setLanguageData] = useState<{
    id: string;
    languageName: string;
    level: string;
  } | null>(null);

  // Form setup with react-hook-form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ClassFormData>({
    defaultValues: {
      name: "",
      description: "",
      schedule: "",
      languageClassId: languageId || "",
      batch: 1,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Default to 3 months from now
    },
  });

  // Watch startDate to validate endDate
  const startDate = watch("startDate");

  // Mock function to fetch language data
  useEffect(() => {
    if (!languageId) {
      router.push("/class-setting");
      return;
    }

    // Simulate API call to get language details
    // In real implementation, replace with actual API call
    setTimeout(() => {
      const mockLanguages = [
        {
          id: "1",
          languageName: "Bahasa Jepang",
          level: "Intermediate",
        },
        {
          id: "2",
          languageName: "Bahasa Mandarin",
          level: "Beginner",
        },
        {
          id: "3",
          languageName: "Bahasa Jerman",
          level: "Advanced",
        },
      ];

      const language = mockLanguages.find((lang) => lang.id === languageId);
      if (language) {
        setLanguageData(language);
      } else {
        router.push("/class-setting");
      }
    }, 500);
  }, [languageId, router]);

  const onSubmit = async (data: ClassFormData) => {
    setIsSubmitting(true);

    // Simulate API call for creating class
    // In real implementation, replace with actual API call
    try {
      console.log("Submitting data:", data);

      // Simulate server delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success! Redirect back
      router.push("/class-setting?success=true&message=Kelas berhasil dibuat");
    } catch (error) {
      console.error("Error creating class:", error);
      setIsSubmitting(false);
    }
  };

  if (!languageData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            component={Link}
            href="/class-setting"
            size="sm"
            variant="plain"
            color="neutral"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography level="h2">Buat Kelas Baru</Typography>
        </Box>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Left Column - Main Form */}
          <Grid xs={12} md={8}>
            <Card variant="outlined" sx={{ p: 3 }}>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                Informasi Kelas
              </Typography>

              <Grid container spacing={2}>
                <Grid xs={12}>
                  <FormControl error={!!errors.name} required>
                    <FormLabel>Nama Kelas</FormLabel>
                    <Input
                      placeholder="Contoh: Kelas Bahasa Jepang Batch 1"
                      {...register("name", {
                        required: "Nama kelas harus diisi",
                      })}
                    />
                    {errors.name && (
                      <Typography level="body-xs" color="danger">
                        {errors.name.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid xs={12}>
                  <FormControl error={!!errors.description} required>
                    <FormLabel>Deskripsi Kelas</FormLabel>
                    <Textarea
                      minRows={3}
                      placeholder="Deskripsi tentang kelas ini"
                      {...register("description", {
                        required: "Deskripsi kelas harus diisi",
                      })}
                    />
                    {errors.description && (
                      <Typography level="body-xs" color="danger">
                        {errors.description.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6}>
                  <FormControl error={!!errors.schedule} required>
                    <FormLabel>Jadwal</FormLabel>
                    <Input
                      placeholder="Contoh: Senin & Rabu, 19:00-21:00"
                      {...register("schedule", {
                        required: "Jadwal kelas harus diisi",
                      })}
                    />
                    {errors.schedule && (
                      <Typography level="body-xs" color="danger">
                        {errors.schedule.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6}>
                  <FormControl error={!!errors.batch} required>
                    <FormLabel>Batch</FormLabel>
                    <Input
                      type="number"
                      placeholder="1"
                      slotProps={{ input: { min: 1 } }}
                      {...register("batch", {
                        required: "Batch harus diisi",
                        min: {
                          value: 1,
                          message: "Batch minimal 1",
                        },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.batch && (
                      <Typography level="body-xs" color="danger">
                        {errors.batch.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6}>
                  <FormControl error={!!errors.startDate} required>
                    <FormLabel>Tanggal Mulai</FormLabel>
                    <Controller
                      name="startDate"
                      control={control}
                      rules={{ required: "Tanggal mulai harus diisi" }}
                      render={({ field }) => (
                        <Box sx={{ position: "relative" }}>
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat="dd/MM/yyyy"
                            customInput={
                              <Input
                                placeholder="DD/MM/YYYY"
                                endDecorator={<CalendarIcon />}
                              />
                            }
                          />
                        </Box>
                      )}
                    />
                    {errors.startDate && (
                      <Typography level="body-xs" color="danger">
                        {errors.startDate.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6}>
                  <FormControl error={!!errors.endDate} required>
                    <FormLabel>Tanggal Selesai</FormLabel>
                    <Controller
                      name="endDate"
                      control={control}
                      rules={{
                        required: "Tanggal selesai harus diisi",
                        validate: (value) =>
                          value > startDate ||
                          "Tanggal selesai harus setelah tanggal mulai",
                      }}
                      render={({ field }) => (
                        <Box sx={{ position: "relative" }}>
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat="dd/MM/yyyy"
                            minDate={startDate}
                            customInput={
                              <Input
                                placeholder="DD/MM/YYYY"
                                endDecorator={<CalendarIcon />}
                              />
                            }
                          />
                        </Box>
                      )}
                    />
                    {errors.endDate && (
                      <Typography level="body-xs" color="danger">
                        {errors.endDate.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Card>

            <Card variant="outlined" sx={{ p: 3, mt: 3 }}>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                Materi & Kurikulum
              </Typography>

              <Alert
                size="sm"
                color="neutral"
                variant="soft"
                startDecorator={<InfoIcon />}
                sx={{ mb: 2 }}
              >
                Anda dapat menambahkan materi setelah kelas dibuat.
              </Alert>
            </Card>
          </Grid>

          {/* Right Column - Summary & Actions */}
          <Grid xs={12} md={4}>
            <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                Bahasa
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <LanguageIcon color="primary" />
                <Typography level="title-md">
                  {languageData.languageName}
                </Typography>
              </Box>

              <Chip size="sm" variant="soft">
                Level: {languageData.level}
              </Chip>

              <Input
                type="hidden"
                {...register("languageClassId")}
                value={languageId || ""}
              />
            </Card>

            <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                Tindakan
              </Typography>

              <Stack spacing={2}>
                <Button
                  type="submit"
                  fullWidth
                  startDecorator={<SaveIcon />}
                  loading={isSubmitting}
                >
                  Simpan Kelas
                </Button>

                <Button
                  component={Link}
                  href="/class-setting"
                  variant="outlined"
                  color="neutral"
                  fullWidth
                >
                  Batal
                </Button>
              </Stack>
            </Card>

            <Card variant="outlined" sx={{ p: 3 }}>
              <Typography level="title-lg" sx={{ mb: 2 }}>
                Tips
              </Typography>

              <Typography level="body-sm">
                • Nama kelas sebaiknya mencakup nama bahasa dan batch
              </Typography>

              <Typography level="body-sm">
                • Pastikan jadwal mencakup hari dan waktu
              </Typography>

              <Typography level="body-sm">
                • Deskripsi yang baik meningkatkan ketertarikan siswa
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
