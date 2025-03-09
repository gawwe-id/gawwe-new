import { Box, Button, Grid, Typography } from "@mui/joy";
import Link from "next/link";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("class");

  if (!selectedLanguageId) {
    return (
      <EmptyState
        icon={<SchoolIcon sx={{ fontSize: 40 }} />}
        title={t("classSetting.selectLanguage")}
        description={t("classSetting.languagesSection.noLanguagesDescription")}
      />
    );
  }

  if (isPending) {
    return <Box>{t("common.status.loading")}</Box>;
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
        <Typography level="title-lg">
          {t("classSetting.classesSection.title", { language: languageName })}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ViewToggle viewMode={viewMode} onViewChange={onViewChange} />

          <Button
            component={Link}
            href={`/class-setting/create?languageId=${selectedLanguageId}`}
            startDecorator={<AddIcon />}
            size="sm"
          >
            {t("classSetting.classesSection.createNewClass")}
          </Button>
        </Box>
      </Box>

      {!classes?.length ? (
        <EmptyState
          icon={<SchoolIcon sx={{ fontSize: 40 }} />}
          title={t("classSetting.classesSection.noClasses")}
          description={t("classSetting.classesSection.noClassesDescription")}
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
