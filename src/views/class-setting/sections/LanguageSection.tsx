"use client";

import { Box, Button, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import {
  AddRounded as AddIcon,
  LanguageRounded as LanguageIcon,
} from "@mui/icons-material";
import EmptyState from "@/components/common/EmptyState";
import LanguageCard from "./LanguageCard";

interface LanguageSectionProps {
  languages:
    | Array<{
        id: string;
        languageName: string;
        level: string;
        classCount: number;
      }>
    | undefined;
  selectedLanguageId: string | null;
  onSelectLanguage: (id: string | null) => void;
  onOpenAddLanguageModal: () => void;
  isPending: boolean;
}

export default function LanguageSection({
  languages,
  selectedLanguageId,
  onSelectLanguage,
  onOpenAddLanguageModal,
  isPending,
}: LanguageSectionProps) {
  const { t } = useTranslation("class");

  if (isPending) {
    return <Box>{t("common.status.loading")}</Box>;
  }

  const handleLanguageClick = (id: string) => {
    onSelectLanguage(id === selectedLanguageId ? null : id);
  };

  return (
    <>
      <Typography level="title-lg" sx={{ mb: 2 }}>
        {t("classSetting.languagesSection.title")}
      </Typography>

      {!languages?.length ? (
        <EmptyState
          icon={<LanguageIcon sx={{ fontSize: 40 }} />}
          title={t("classSetting.languagesSection.noLanguages")}
          description={t(
            "classSetting.languagesSection.noLanguagesDescription"
          )}
          action={
            <Button
              startDecorator={<AddIcon />}
              onClick={onOpenAddLanguageModal}
            >
              {t("classSetting.addLanguage")}
            </Button>
          }
        />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {languages.map((language) => (
            <LanguageCard
              key={language.id}
              language={language}
              isSelected={language.id === selectedLanguageId}
              onClick={handleLanguageClick}
            />
          ))}
        </Box>
      )}
    </>
  );
}
