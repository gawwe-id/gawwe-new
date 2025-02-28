import { Box, Button, Typography } from "@mui/joy";
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
  if (isPending) {
    return <Box>Loading...</Box>;
  }

  const handleLanguageClick = (id: string) => {
    onSelectLanguage(id === selectedLanguageId ? null : id);
  };

  return (
    <>
      <Typography level="title-lg" sx={{ mb: 2 }}>
        Bahasa yang Tersedia
      </Typography>

      {!languages?.length ? (
        <EmptyState
          icon={<LanguageIcon sx={{ fontSize: 40 }} />}
          title="Belum Ada Bahasa"
          description="Anda belum menambahkan bahasa apapun. Tambahkan bahasa untuk mulai membuat kelas."
          action={
            <Button
              startDecorator={<AddIcon />}
              onClick={onOpenAddLanguageModal}
            >
              Tambah Bahasa
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
