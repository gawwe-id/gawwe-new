"use client";

import * as React from "react";
import { Box, Tabs, TabPanel } from "@mui/joy";
import { useRouter, useSearchParams } from "next/navigation";

// _components
import TabsAssignment from "./_components/TabsAssignment";
import TaskContent from "./task";
import ExamContent from "./exam";

export default function TaskManagement() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("activetab") || "0";

  const handleTabChange = (
    event: React.SyntheticEvent | null,
    newValue: string | number | null
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("activetab", newValue?.toString() || "0");
    router.push(`/assignments?${params.toString()}`);
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 4 }, maxWidth: "1300px", mx: "auto" }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ bgcolor: "transparent" }}
      >
        <TabsAssignment activeTab={activeTab} />

        <TabPanel value="0">
          <TaskContent />
        </TabPanel>
        <TabPanel value="1">
          <ExamContent />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
