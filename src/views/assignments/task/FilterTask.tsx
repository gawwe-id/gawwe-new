import { useTaskStore } from "@/store/taskStore";
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

interface FilterTaskProps {
  classes: Class[] | undefined;
}

const FilterTask = ({ classes }: FilterTaskProps) => {
  const { t } = useTranslation("assignment");

  const {
    searchTerm,
    selectedClass,
    dateRange,
    setSearchTerm,
    setSelectedClass,
    setDateRange,
    resetFilters,
  } = useTaskStore();

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
          <FormLabel>{t("task.filter.search")}</FormLabel>
          <Input
            size="sm"
            startDecorator={<SearchRounded />}
            placeholder={t("task.filter.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>

        <FormControl sx={{ maxWidth: 240 }}>
          <FormLabel>{t("task.filter.filterByClass")}</FormLabel>
          <Select
            size="sm"
            placeholder={t("task.filter.selectClass")}
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
          <FormLabel>{t("task.filter.startDate")}</FormLabel>
          <DatePicker
            selected={dateRange.start}
            onChange={(date) => setDateRange({ start: date })}
            selectsStart
            startDate={dateRange.start}
            endDate={dateRange.end}
            placeholderText={t("task.filter.startDate")}
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
          <FormLabel>{t("task.filter.endDate")}</FormLabel>
          <DatePicker
            selected={dateRange.end}
            onChange={(date) => setDateRange({ end: date })}
            selectsEnd
            startDate={dateRange.start}
            endDate={dateRange.end}
            // minDate={dateRange.start}
            placeholderText={t("task.filter.endDate")}
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
          {t("task.filter.clearFilters")}
        </Button>
      </Box>
    </Card>
  );
};

export default FilterTask;
