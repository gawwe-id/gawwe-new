import { Tab, tabClasses, TabList } from "@mui/joy";
import React from "react";
import { useTranslation } from "react-i18next";

interface TabsAssignmentProps {
  activeTab: string;
}

const TabsAssignment = ({ activeTab }: TabsAssignmentProps) => {
  const { t } = useTranslation("assignment");

  return (
    <TabList
      tabFlex={1}
      size="sm"
      sx={{
        justifyContent: "left",
        [`&& .${tabClasses.root}`]: {
          fontWeight: "600",
          flex: "initial",
          color: "text.tertiary",
          [`&.${tabClasses.selected}`]: {
            bgcolor: "transparent",
            color: "text.primary",
            backgroundColor: "primary.100",
            "&::after": {
              height: "2px",
              bgcolor: "primary.500",
            },
          },
        },
      }}
    >
      {[
        { value: "0", label: t("tabs.task") },
        { value: "1", label: t("tabs.exam") },
        { value: "2", label: t("tabs.quiz") },
      ].map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          sx={{ borderRadius: "6px 6px 0 0" }}
          indicatorInset
        >
          {tab.label}
        </Tab>
      ))}
    </TabList>
  );
};

export default TabsAssignment;
