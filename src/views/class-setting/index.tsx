"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// UI Components
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Divider,
  AspectRatio,
  Sheet,
  CardContent,
  CardActions,
  CardOverflow,
  IconButton,
  Chip,
  Table,
  Tooltip,
} from "@mui/joy";

import {
  AddRounded as AddIcon,
  SchoolRounded as SchoolIcon,
  MoreVertRounded as MoreIcon,
  LanguageRounded as LanguageIcon,
  GridViewRounded as GridViewIcon,
  TableRowsRounded as TableRowsIcon,
  EditRounded as EditIcon,
  VisibilityRounded as VisibilityIcon,
} from "@mui/icons-material";

// Zustand store
import { useLanguageStore } from "@/store/useLanguageStore";

// Components
import AddLanguageDialog from "./dialog/AddLanguageDialog";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

// Mocked data for UI preview
const mockLanguages = [
  {
    id: "1",
    languageName: "Bahasa Jepang",
    level: "Intermediate",
    classCount: 3,
  },
  {
    id: "2",
    languageName: "Bahasa Mandarin",
    level: "Beginner",
    classCount: 2,
  },
  { id: "3", languageName: "Bahasa Jerman", level: "Advanced", classCount: 1 },
];

const mockClasses: any = {
  "1": [
    {
      id: "101",
      name: "Kelas Bahasa Jepang Batch 7",
      batch: 7,
      schedule: "Senin & Rabu, 19:00-21:00",
      imageUrl: "/images/japanese.jpg",
    },
    {
      id: "102",
      name: "Kelas Bahasa Jepang JLPT N4",
      batch: 6,
      schedule: "Selasa & Kamis, 17:00-19:00",
      imageUrl: "/images/japanese2.jpg",
    },
    {
      id: "103",
      name: "Kelas Bahasa Jepang Intensif",
      batch: 5,
      schedule: "Sabtu & Minggu, 09:00-12:00",
      imageUrl: "/images/japanese3.jpg",
    },
  ],
  "2": [
    {
      id: "201",
      name: "Kelas Mandarin HSK 1",
      batch: 3,
      schedule: "Senin & Kamis, 18:00-20:00",
      imageUrl: "/images/mandarin.jpg",
    },
    {
      id: "202",
      name: "Kelas Mandarin Bisnis",
      batch: 2,
      schedule: "Sabtu, 13:00-16:00",
      imageUrl: "/images/mandarin2.jpg",
    },
  ],
  "3": [
    {
      id: "301",
      name: "Kelas Bahasa Jerman A1",
      batch: 1,
      schedule: "Jumat, 18:00-21:00",
      imageUrl: "/images/german.jpg",
    },
  ],
};

export default function ClassSettingsPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Zustand store for modal management
  const {
    isAddLanguageModalOpen,
    openAddLanguageModal,
    closeAddLanguageModal,
  } = useLanguageStore();

  const { data: languagesClasses, isPending } = useQuery({
    queryKey: ["language-classes"],
    queryFn: async () => {
      const res = await client.languageClasses.list.$get();
      return await res.json();
    },
  });

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      <PageHeader
        title="Pengaturan Kelas"
        description="Kelola bahasa dan kelas yang Anda tawarkan"
        action={
          <Button
            startDecorator={<AddIcon />}
            color="primary"
            onClick={openAddLanguageModal}
            size="sm"
          >
            Tambah Bahasa
          </Button>
        }
      />

      <Divider sx={{ my: 3 }} />

      {/* Two-column layout */}
      <Grid container spacing={3}>
        {/* Left column - Languages (4 columns width) */}
        <Grid xs={12} md={4}>
          <Typography level="title-lg" sx={{ mb: 2 }}>
            Bahasa yang Tersedia
          </Typography>

          {mockLanguages.length === 0 ? (
            <EmptyState
              icon={<LanguageIcon sx={{ fontSize: 40 }} />}
              title="Belum Ada Bahasa"
              description="Anda belum menambahkan bahasa apapun. Tambahkan bahasa untuk mulai membuat kelas."
              action={
                <Button
                  startDecorator={<AddIcon />}
                  onClick={openAddLanguageModal}
                >
                  Tambah Bahasa
                </Button>
              }
            />
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {mockLanguages.map((language) => (
                <Card
                  key={language.id}
                  variant="outlined"
                  sx={{
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "md",
                      borderColor: "primary.300",
                    },
                    cursor: "pointer",
                    borderColor:
                      language.id === selectedLanguage
                        ? "primary.500"
                        : undefined,
                    bgcolor:
                      language.id === selectedLanguage
                        ? "primary.50"
                        : undefined,
                  }}
                  onClick={() =>
                    setSelectedLanguage(
                      language.id === selectedLanguage ? null : language.id
                    )
                  }
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LanguageIcon
                        sx={{
                          mr: 1,
                          color:
                            language.id === selectedLanguage
                              ? "primary.500"
                              : "neutral.500",
                        }}
                      />
                      <Typography level="title-md" sx={{ flex: 1 }}>
                        {language.languageName}
                      </Typography>
                      <IconButton size="sm" variant="plain">
                        <MoreIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <Chip size="sm" variant="soft">
                        Level: {language.level}
                      </Chip>
                      <Chip size="sm" variant="soft" color="primary">
                        {language.classCount} Kelas
                      </Chip>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Grid>

        {/* Right column - Classes (8 columns width) */}
        <Grid xs={12} md={8}>
          {selectedLanguage ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography level="title-lg">
                  Kelas{" "}
                  {
                    mockLanguages.find((lang) => lang.id === selectedLanguage)
                      ?.languageName
                  }
                </Typography>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  {/* View toggle */}
                  <Box
                    sx={{
                      display: "flex",
                      borderRadius: "md",
                      overflow: "hidden",
                    }}
                  >
                    <Tooltip title="Card View">
                      <IconButton
                        variant={viewMode === "card" ? "solid" : "plain"}
                        color={viewMode === "card" ? "primary" : "neutral"}
                        onClick={() => setViewMode("card")}
                        size="sm"
                      >
                        <GridViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Table View">
                      <IconButton
                        variant={viewMode === "table" ? "solid" : "plain"}
                        color={viewMode === "table" ? "primary" : "neutral"}
                        onClick={() => setViewMode("table")}
                        size="sm"
                      >
                        <TableRowsIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Button
                    component={Link}
                    href={`/class-setting/create?languageId=${selectedLanguage}`}
                    startDecorator={<AddIcon />}
                    size="sm"
                  >
                    Buat Kelas Baru
                  </Button>
                </Box>
              </Box>

              {mockClasses[selectedLanguage].length === 0 ? (
                <EmptyState
                  icon={<SchoolIcon sx={{ fontSize: 40 }} />}
                  title="Belum Ada Kelas"
                  description="Anda belum membuat kelas untuk bahasa ini."
                  action={
                    <Button
                      startDecorator={<AddIcon />}
                      component={Link}
                      href={`/class-setting/create?languageId=${selectedLanguage}`}
                    >
                      Buat Kelas Baru
                    </Button>
                  }
                />
              ) : viewMode === "table" ? (
                <Sheet
                  variant="outlined"
                  sx={{ borderRadius: "md", overflow: "auto" }}
                >
                  <Table>
                    <thead>
                      <tr>
                        <th style={{ width: "40%" }}>Nama Kelas</th>
                        <th style={{ width: "15%" }}>Batch</th>
                        <th style={{ width: "30%" }}>Jadwal</th>
                        <th style={{ width: "15%", textAlign: "center" }}>
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockClasses[selectedLanguage].map((classItem: any) => (
                        <tr key={classItem.id}>
                          <td>{classItem.name}</td>
                          <td>
                            <Chip size="sm" variant="soft">
                              Batch {classItem.batch}
                            </Chip>
                          </td>
                          <td>{classItem.schedule}</td>
                          <td>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <Tooltip title="Edit Kelas">
                                <IconButton
                                  size="sm"
                                  variant="plain"
                                  color="neutral"
                                  onClick={() =>
                                    router.push(
                                      `/class-setting/edit/${classItem.id}`
                                    )
                                  }
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Detail Kelas">
                                <IconButton
                                  size="sm"
                                  variant="plain"
                                  color="primary"
                                  onClick={() =>
                                    router.push(
                                      `/class-setting/detail/${classItem.id}`
                                    )
                                  }
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Sheet>
              ) : (
                <Grid container spacing={3}>
                  {mockClasses[selectedLanguage].map((classItem: any) => (
                    <Grid key={classItem.id} xs={12} sm={6} lg={4}>
                      <Card
                        variant="outlined"
                        sx={{
                          height: "100%",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            boxShadow: "md",
                            borderColor: "primary.300",
                          },
                          overflow: "hidden",
                        }}
                      >
                        <CardOverflow>
                          <AspectRatio ratio="16/9">
                            <Box
                              sx={{
                                backgroundColor: "primary.100",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <SchoolIcon
                                sx={{ fontSize: 40, color: "primary.600" }}
                              />
                            </Box>
                          </AspectRatio>
                        </CardOverflow>

                        <CardContent>
                          <Typography level="title-md">
                            {classItem.name}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, my: 1 }}>
                            <Chip size="sm" variant="soft">
                              Batch {classItem.batch}
                            </Chip>
                          </Box>
                          <Typography
                            level="body-sm"
                            sx={{ color: "text.secondary", mb: 1 }}
                          >
                            {classItem.schedule}
                          </Typography>
                        </CardContent>

                        <CardOverflow variant="soft">
                          <CardActions>
                            <Button
                              variant="plain"
                              color="neutral"
                              onClick={() =>
                                router.push(
                                  `/class-setting/edit/${classItem.id}`
                                )
                              }
                              sx={{ flex: 1 }}
                            >
                              Edit
                            </Button>
                            <Divider orientation="vertical" />
                            <Button
                              variant="plain"
                              color="primary"
                              onClick={() =>
                                router.push(
                                  `/class-setting/detail/${classItem.id}`
                                )
                              }
                              sx={{ flex: 1 }}
                            >
                              Detail
                            </Button>
                          </CardActions>
                        </CardOverflow>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          ) : (
            <EmptyState
              icon={<SchoolIcon sx={{ fontSize: 40 }} />}
              title="Pilih Bahasa"
              description="Silakan pilih bahasa dari daftar di sebelah kiri untuk melihat kelas yang tersedia."
            />
          )}
        </Grid>
      </Grid>

      {/* Add Language Modal - This will be controlled by Zustand */}
      <AddLanguageDialog
        open={isAddLanguageModalOpen}
        onClose={closeAddLanguageModal}
      />
    </Box>
  );
}
