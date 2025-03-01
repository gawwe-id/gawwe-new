"use client";

import { useState } from "react";

// UI Components
import { Box, Button, Grid, Divider } from "@mui/joy";

import { AddRounded as AddIcon } from "@mui/icons-material";

// Zustand store
import { useLanguageStore } from "@/store/useLanguageStore";

// Components
import AddLanguageDialog from "./dialog/AddLanguageDialog";
import PageHeader from "@/components/common/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import LanguageSection from "./sections/LanguageSection";
import ClassesSection from "./sections/ClassesSection";

export default function ClassSettingsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const {
    isAddLanguageModalOpen,
    openAddLanguageModal,
    closeAddLanguageModal,
  } = useLanguageStore();

  const { data: languagesClasses, isPending: isPendingLanguages } = useQuery({
    queryKey: ["language-classes"],
    queryFn: async () => {
      const res = await client.languageClasses.list.$get();
      return await res.json();
    },
  });

  const { data: classes, isPending: isPendingClasses } = useQuery({
    queryKey: ["classes-by-language", selectedLanguage],
    queryFn: async () => {
      const res = await client.classes.byLanguage.$get({
        languageClassId: selectedLanguage as string,
      });
      return await res.json();
    },
    enabled: !!selectedLanguage,
  });

  // Get the name of the selected language
  const selectedLanguageName = languagesClasses?.data?.find(
    (lang) => lang.id === selectedLanguage
  )?.languageName;

  // Handler for view mode toggle
  const handleViewModeChange = (mode: "card" | "table") => {
    setViewMode(mode);
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, maxWidth: "1300px", mx: "auto" }}>
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

      <Grid container spacing={3}>
        {/* Languages Section */}
        <Grid xs={12} md={3}>
          <LanguageSection
            languages={languagesClasses?.data}
            selectedLanguageId={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            onOpenAddLanguageModal={openAddLanguageModal}
            isPending={isPendingLanguages}
          />
        </Grid>

        {/* Classes Section */}
        <Grid xs={12} md={9}>
          <ClassesSection
            selectedLanguageId={selectedLanguage}
            languageName={selectedLanguageName}
            classes={classes?.data}
            viewMode={viewMode}
            onViewChange={handleViewModeChange}
            isPending={isPendingClasses}
          />
        </Grid>
      </Grid>

      {/* Add Language Modal */}
      <AddLanguageDialog
        open={isAddLanguageModalOpen}
        onClose={closeAddLanguageModal}
      />
    </Box>
  );
}
