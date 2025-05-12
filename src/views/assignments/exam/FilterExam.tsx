import { useTranslation } from "react-i18next";
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
import {
  ClassRounded,
  DateRangeRounded,
  SearchRounded,
} from "@mui/icons-material";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useExamStore } from "@/store/examStore";

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

interface FilterExamProps {
  classes: Class[] | undefined;
}

const FilterExam = ({ classes }: FilterExamProps) => {
  const { t } = useTranslation("assignment");
  const {
    searchTerm,
    selectedClass,
    dateRange,
    status,
    setSearchTerm,
    setSelectedClass,
    setDateRange,
    setStatus,
    resetFilters,
  } = useExamStore();

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
          <FormLabel>{t("exam.filter.search")}</FormLabel>
          <Input
            size="sm"
            startDecorator={<SearchRounded />}
            placeholder={t("exam.filter.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>

        <FormControl sx={{ maxWidth: 240 }}>
          <FormLabel>{t("exam.filter.status")}</FormLabel>
          <Select
            size="sm"
            placeholder={t("exam.filter.selectStatus")}
            value={status}
            onChange={(_, value) => setStatus(value as string)}
          >
            <Option value="">{t("exam.filter.allStatuses")}</Option>
            <Option value="draft">{t("exam.status.draft")}</Option>
            <Option value="published">{t("exam.status.published")}</Option>
            <Option value="ongoing">{t("exam.status.ongoing")}</Option>
            <Option value="completed">{t("exam.status.completed")}</Option>
            <Option value="cancelled">{t("exam.status.cancelled")}</Option>
          </Select>
        </FormControl>

        <FormControl sx={{ maxWidth: 240 }}>
          <FormLabel>{t("exam.filter.filterByClass")}</FormLabel>
          <Select
            size="sm"
            placeholder={t("exam.filter.selectClass")}
            value={selectedClass}
            onChange={(_, value) => setSelectedClass(value)}
            startDecorator={<ClassRounded />}
          >
            <Option value="">{t("exam.filter.allClasses")}</Option>
            {classes?.map((classItem: Class) => (
              <Option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </Option>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ maxWidth: 240 }}>
          <FormLabel>{t("exam.filter.startDate")}</FormLabel>
          <DatePicker
            selected={dateRange.start}
            onChange={(date) => setDateRange({ start: date })}
            selectsStart
            startDate={dateRange.start}
            endDate={dateRange.end}
            placeholderText={t("exam.filter.startDate")}
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
          <FormLabel>{t("exam.filter.endDate")}</FormLabel>
          <DatePicker
            selected={dateRange.end}
            onChange={(date) => setDateRange({ end: date })}
            selectsEnd
            startDate={dateRange.start}
            endDate={dateRange.end}
            // minDate={filterOptions.dateRange.start}
            placeholderText={t("exam.filter.endDate")}
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
          {t("exam.filter.clearFilters")}
        </Button>
      </Box>
    </Card>
  );
};

export default FilterExam;
