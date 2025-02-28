import { Box, Button, Grid, Typography } from "@mui/joy";
import Link from "next/link";
import {
  AddRounded as AddIcon,
  SchoolRounded as SchoolIcon,
} from "@mui/icons-material";
import EmptyState from "@/components/common/EmptyState";
import ViewToggle from "./ViewToggle";
import ClassesTable from "./ClassesTable";
import ClassCard from "./ClassCard";

interface ClassesSectionProps {
  selectedLanguageId: string | null;
  languageName: string | undefined;
  classes: Array<any> | undefined;
  viewMode: "card" | "table";
  onViewChange: (mode: "card" | "table") => void;
  isPending: boolean;
}

export default function ClassesSection({
  selectedLanguageId,
  languageName,
  classes,
  viewMode,
  onViewChange,
  isPending,
}: ClassesSectionProps) {
  if (!selectedLanguageId) {
    return (
      <EmptyState
        icon={<SchoolIcon sx={{ fontSize: 40 }} />}
        title="Pilih Bahasa"
        description="Silakan pilih bahasa dari daftar di sebelah kiri untuk melihat kelas yang tersedia."
      />
    );
  }

  if (isPending) {
    return <Box>Loading...</Box>;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography level="title-lg">Kelas Bahasa {languageName}</Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ViewToggle viewMode={viewMode} onViewChange={onViewChange} />

          <Button
            component={Link}
            href={`/class-setting/create?languageId=${selectedLanguageId}`}
            startDecorator={<AddIcon />}
            size="sm"
          >
            Buat Kelas Baru
          </Button>
        </Box>
      </Box>

      {!classes?.length ? (
        <EmptyState
          icon={<SchoolIcon sx={{ fontSize: 40 }} />}
          title="Belum Ada Kelas"
          description="Anda belum membuat kelas untuk bahasa ini."
        />
      ) : viewMode === "table" ? (
        <ClassesTable classes={classes} />
      ) : (
        <Grid container spacing={3}>
          {classes.map((classItem) => (
            <Grid key={classItem.id} xs={12} sm={6} lg={4}>
              <ClassCard classItem={classItem} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
