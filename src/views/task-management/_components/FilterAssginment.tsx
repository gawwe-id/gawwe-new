import { useTaskManagementStore } from "@/store/taskManagementStore";
import {
  ClassRounded,
  DateRangeRounded,
  SearchRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
} from "@mui/joy";
import React from "react";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";

type Class = {
  id: string;
  name: string;
  description: string;
  schedules: {
    id: string;
    classId: string;
    day: string;
    startTime: string;
    endTime: string;
  }[];
  languageClassId: string;
  batch: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

interface FilterAssginmentProps {
  classes: Class[] | undefined;
}

const FilterAssginment = ({ classes }: FilterAssginmentProps) => {
  const { t } = useTranslation("assignment");

  const {
    searchTerm,
    selectedClass,
    dateRange,
    setSearchTerm,
    setSelectedClass,
    setDateRange,
    resetFilters,
  } = useTaskManagementStore();

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "flex-end",
          p: 2,
        }}
      >
        <FormControl sx={{ maxWidth: 240 }}>
          <FormLabel>{t("filter.search")}</FormLabel>
          <Input
            size="sm"
            startDecorator={<SearchRounded />}
            placeholder={t("filter.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>

        <FormControl sx={{ maxWidth: 240 }}>
          <FormLabel>{t("filter.filterByClass")}</FormLabel>
          <Select
            size="sm"
            placeholder={t("filter.selectClass")}
            value={selectedClass}
            onChange={(_, value) => setSelectedClass(value)}
            startDecorator={<ClassRounded />}
          >
            {classes?.map((classItem: Class) => (
              <Option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </Option>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ maxWidth: 240 }}>
          <FormLabel>{t("filter.startDate")}</FormLabel>
          <DatePicker
            selected={dateRange.start}
            onChange={(date) => setDateRange({ start: date })}
            selectsStart
            startDate={dateRange.start}
            endDate={dateRange.end}
            placeholderText={t("filter.startDate")}
            customInput={
              <Input
                startDecorator={<DateRangeRounded />}
                fullWidth
                size="sm"
              />
            }
          />
        </FormControl>

        <FormControl sx={{ maxWidth: 240 }}>
          <FormLabel>{t("filter.endDate")}</FormLabel>
          <DatePicker
            selected={dateRange.end}
            onChange={(date) => setDateRange({ end: date })}
            selectsEnd
            startDate={dateRange.start}
            endDate={dateRange.end}
            // minDate={dateRange.start}
            placeholderText={t("filter.endDate")}
            customInput={
              <Input
                startDecorator={<DateRangeRounded />}
                fullWidth
                size="sm"
              />
            }
          />
        </FormControl>

        <Button size="sm" variant="plain" color="danger" onClick={resetFilters}>
          {t("filter.clearFilters")}
        </Button>
      </Box>
    </Card>
  );
};

export default FilterAssginment;
