"use client";

import { Box, IconButton, Tooltip } from "@mui/joy";
import { useTranslation } from "react-i18next";
import {
  GridViewRounded as GridViewIcon,
  TableRowsRounded as TableRowsIcon,
} from "@mui/icons-material";

interface ViewToggleProps {
  viewMode: "card" | "table";
  onViewChange: (mode: "card" | "table") => void;
}

export default function ViewToggle({
  viewMode,
  onViewChange,
}: ViewToggleProps) {
  const { t } = useTranslation("class");

  return (
    <Box sx={{ display: "flex", borderRadius: "md", overflow: "hidden" }}>
      <Tooltip title={t("classSetting.classesSection.viewModes.card")}>
        <IconButton
          variant={viewMode === "card" ? "soft" : "plain"}
          color={viewMode === "card" ? "primary" : "neutral"}
          onClick={() => onViewChange("card")}
          size="sm"
        >
          <GridViewIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("classSetting.classesSection.viewModes.table")}>
        <IconButton
          variant={viewMode === "table" ? "soft" : "plain"}
          color={viewMode === "table" ? "primary" : "neutral"}
          onClick={() => onViewChange("table")}
          size="sm"
        >
          <TableRowsIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
