"use client";

import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// UI Components
import { Box, Button, Grid, Divider } from "@mui/joy";

// Zustand store
import { useLanguageStore } from "@/store/useLanguageStore";

// Components
import AddLanguageDialog from "./dialog/AddLanguageDialog";
import PageHeader from "@/components/common/PageHeader";
import LanguageSection from "./sections/LanguageSection";
import ClassesSection from "./sections/ClassesSection";

// assets
import { AddRounded as AddIcon } from "@mui/icons-material";

export default function ClassSettingsPage() {
  const { t } = useTranslation("class");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get state from URL
  const selectedLanguage = searchParams.get("language");
  const viewMode = (searchParams.get("view") || "card") as "card" | "table";

  const {
    isAddLanguageModalOpen,
    openAddLanguageModal,
    closeAddLanguageModal,
  } = useLanguageStore();

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams]
  );

  // Handler to update selectedLanguage
  const handleLanguageSelect = useCallback(
    (id: string | null) => {
      router.push(`${pathname}?${createQueryString("language", id)}`, {
        scroll: false,
      });
    },
    [pathname, router, createQueryString]
  );

  // Handler for view mode toggle
  const handleViewModeChange = useCallback(
    (mode: "card" | "table") => {
      router.push(`${pathname}?${createQueryString("view", mode)}`, {
        scroll: false,
      });
    },
    [pathname, router, createQueryString]
  );

  const { data: languagesClasses, isPending: isPendingLanguages } = useQuery({
    queryKey: ["language-classes"],
    queryFn: async () => {
      const res = await client.languageClasses.list.$get();
      return await res.json();
    },
  });

  useEffect(() => {
    if (
      !selectedLanguage &&
      languagesClasses &&
      languagesClasses?.data?.length > 0 &&
      !isPendingLanguages
    ) {
      // Select the first language in the list
      const firstLanguageId = languagesClasses?.data?.[0]?.id as string;
      router.push(
        `${pathname}?${createQueryString(
          "language",
          firstLanguageId
        )}&${createQueryString("view", "card")}`,
        { scroll: false }
      );
    }
  }, [
    languagesClasses,
    selectedLanguage,
    isPendingLanguages,
    router,
    pathname,
    createQueryString,
  ]);

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

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, maxWidth: "1300px", mx: "auto" }}>
      <PageHeader
        title={t("classSetting.pageTitle")}
        description={t("classSetting.pageDescription")}
        action={
          <Button
            startDecorator={<AddIcon />}
            color="primary"
            onClick={openAddLanguageModal}
            size="sm"
          >
            {t("classSetting.addLanguage")}
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
            onSelectLanguage={handleLanguageSelect}
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
