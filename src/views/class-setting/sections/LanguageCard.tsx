import { Box, Card, CardContent, Chip, Typography } from "@mui/joy";
import { LanguageRounded as LanguageIcon } from "@mui/icons-material";

interface LanguageCardProps {
  language: {
    id: string;
    languageName: string;
    level: string;
    classCount: number;
  };
  isSelected: boolean;
  onClick: (id: string) => void;
}

export default function LanguageCard({
  language,
  isSelected,
  onClick,
}: LanguageCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "md",
          borderColor: "primary.300",
        },
        cursor: "pointer",
        borderColor: isSelected ? "primary.500" : undefined,
        bgcolor: isSelected ? "primary.50" : undefined,
      }}
      onClick={() => onClick(language.id)}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LanguageIcon
            sx={{
              mr: 1,
              color: isSelected ? "primary.500" : "neutral.500",
            }}
          />
          <Typography level="title-md" sx={{ flex: 1 }}>
            Bahasa {language.languageName}
          </Typography>
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
  );
}
