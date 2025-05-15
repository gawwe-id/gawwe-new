"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Joy UI components
import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardOverflow,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Sheet,
  Stack,
  Tab,
  tabClasses,
  TabList,
  TabPanel,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/joy";

// Icons
import {
  AccessTimeRounded,
  ArticleRounded,
  AssignmentRounded,
  BookRounded,
  CalendarMonthRounded,
  CelebrationRounded,
  CheckCircleRounded,
  ClassRounded,
  EmojiEventsRounded,
  FactCheckRounded,
  FeedRounded,
  KeyboardArrowRightRounded,
  MoreVertRounded,
  NotificationsRounded,
  PendingRounded,
  PersonRounded,
  QuizRounded,
  SchoolRounded,
  SearchRounded,
  TipsAndUpdatesRounded,
  TrendingUpRounded,
} from "@mui/icons-material";

// Chart component
import Chart from "react-apexcharts";
import CardWelcome from "./CardWelcome";

// Sample progress data for the chart
const progressData = {
  series: [68],
  options: {
    chart: {
      type: "radialBar" as "radialBar",
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
          margin: 5,
          dropShadow: {
            enabled: false,
            top: 2,
            left: 0,
            color: "#999",
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "18px",
            fontWeight: 600,
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ["Average Results"],
  },
};

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Component for stats card
const StatCard = ({
  title,
  value,
  icon,
  color = "primary",
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: "primary" | "neutral" | "danger" | "success" | "warning" | "info";
}) => (
  <Card variant="outlined" sx={{ height: "100%" }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography level="title-md">{title}</Typography>
      <Box sx={{ color: `${color}.500` }}>{icon}</Box>
    </Box>
    <Typography level="h3" sx={{ mt: 1, color: `${color}.600` }}>
      {value}
    </Typography>
  </Card>
);

// Component for class card
const ClassCard = ({ course }: { course: any }) => (
  <Card variant="outlined" sx={{ height: "100%" }}>
    <CardOverflow>
      <AspectRatio ratio="16/9">
        <img
          src={`/api/placeholder/400/225?text=${encodeURIComponent(course.name)}`}
          alt={course.name}
          loading="lazy"
        />
      </AspectRatio>
      <Chip
        size="sm"
        variant="soft"
        color="primary"
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        {course.language.name}
      </Chip>
    </CardOverflow>
    <CardContent>
      <Typography level="title-md" fontWeight="bold" noWrap>
        {course.name}
      </Typography>
      <Typography level="body-sm" sx={{ mt: 0.5, mb: 1 }}>
        {truncateText(course.description, 80)}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
        <AccessTimeRounded fontSize="small" />
        <Typography level="body-xs">
          {dayjs(course.startDate).format("DD MMM YYYY")} -{" "}
          {dayjs(course.endDate).format("DD MMM YYYY")}
        </Typography>
      </Box>
    </CardContent>
    <CardActions>
      <Button size="sm" variant="solid">
        View Details
      </Button>
      <Button size="sm" variant="outlined">
        Schedule
      </Button>
      <IconButton variant="plain" color="neutral" size="sm" sx={{ ml: "auto" }}>
        <MoreVertRounded />
      </IconButton>
    </CardActions>
  </Card>
);

// Component for assignment card
const AssignmentCard = ({ item }: { item: any }) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      {item.type === "task" ? (
        <AssignmentRounded color="primary" />
      ) : (
        <FactCheckRounded color="info" />
      )}
      <Box sx={{ flex: 1 }}>
        <Typography level="title-sm">{item.title}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
            {item.className}
          </Typography>
          <Divider orientation="vertical" />
          <Typography
            level="body-xs"
            startDecorator={<AccessTimeRounded fontSize="small" />}
            sx={{ color: "text.tertiary" }}
          >
            Due: {dayjs(item.dueDate).format("DD MMM, HH:mm")}
          </Typography>
        </Box>
      </Box>
      {item.status === "completed" ? (
        <Chip
          variant="soft"
          color="success"
          startDecorator={<CheckCircleRounded />}
        >
          Completed
        </Chip>
      ) : (
        <Chip
          variant="soft"
          color="warning"
          startDecorator={<PendingRounded />}
        >
          Pending
        </Chip>
      )}
    </Box>
  </Card>
);

// Component for upcoming schedule item
const ScheduleItem = ({ event }: { event: any }) => (
  <ListItem>
    <ListItemButton sx={{ borderRadius: "sm" }}>
      <ListItemDecorator>
        {event.type === "class" ? (
          <ClassRounded color="primary" />
        ) : event.type === "exam" ? (
          <FactCheckRounded color="error" />
        ) : (
          <AssignmentRounded color="warning" />
        )}
      </ListItemDecorator>
      <ListItemContent>
        <Typography level="title-sm">{event.title}</Typography>
        <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
          {event.className}
        </Typography>
      </ListItemContent>
      <Chip size="sm" variant="soft" color="neutral">
        {event.time}
      </Chip>
    </ListItemButton>
  </ListItem>
);

// Component for blog/article card
const BlogCard = ({ post }: { post: any }) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", gap: 2 }}>
      <AspectRatio ratio="1" sx={{ width: 80, borderRadius: "sm" }}>
        <img
          src={`/api/placeholder/80/80?text=${encodeURIComponent(post.category)}`}
          alt={post.title}
          loading="lazy"
        />
      </AspectRatio>
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip size="sm" variant="soft" color="primary">
            {post.category}
          </Chip>
          <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
            {post.date}
          </Typography>
        </Box>
        <Typography level="title-sm" sx={{ mt: 1 }}>
          {post.title}
        </Typography>
        <Typography
          level="body-xs"
          sx={{
            mt: 0.5,
            mb: 1,
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {post.excerpt}
        </Typography>
      </Box>
    </Box>
  </Card>
);

// Component for achievement card
const AchievementCard = ({ achievement }: { achievement: any }) => (
  <Card
    variant="outlined"
    sx={{ display: "flex", alignItems: "center", mb: 2 }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
      <Avatar
        color={
          achievement.color as
            | "primary"
            | "neutral"
            | "danger"
            | "success"
            | "warning"
        }
        variant="soft"
      >
        {achievement.icon}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography level="title-sm">{achievement.title}</Typography>
        <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
          {achievement.description}
        </Typography>
      </Box>
      {achievement.date && (
        <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
          {achievement.date}
        </Typography>
      )}
    </Box>
  </Card>
);

export default function ParticipantDashboard() {
  const { t } = useTranslation("dashboard");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch classes data (all classes)
  const { data: classesData, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await client.classes.list.$get();
      return res.json();
    },
  });

  // Fetch my enrolled classes
  const { data: myClassesData, isLoading: isLoadingMyClasses } = useQuery({
    queryKey: ["myClasses"],
    queryFn: async () => {
      const res = await client.languageClasses.myClasses.$get();
      return res.json();
    },
  });

  // Fetch assignments data
  const { data: assignmentsData, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const res = await client.assignments.list.$get();
      return res.json();
    },
  });

  // Fetch exams data
  const { data: examsData, isLoading: isLoadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const res = await client.exams.list.$get();
      return res.json();
    },
  });

  // Sample data for blog posts
  const blogPosts = [
    {
      id: 1,
      title: "5 Tips to Learn a Language Faster",
      excerpt:
        "Discover the most effective techniques to accelerate your language learning journey...",
      category: "Learning Tips",
      date: "2 days ago",
    },
    {
      id: 2,
      title: "How to Prepare for a Language Proficiency Test",
      excerpt:
        "Expert advice on how to ace your next language proficiency examination with proper preparation...",
      category: "Exam Prep",
      date: "1 week ago",
    },
    {
      id: 3,
      title: "Cultural Insights: Japanese Business Etiquette",
      excerpt:
        "Learn the essential cultural nuances and business customs of Japan to enhance your professional interactions...",
      category: "Cultural Insights",
      date: "2 weeks ago",
    },
  ];

  // Sample data for schedule
  const scheduleEvents = [
    {
      id: 1,
      title: "English Conversation Class",
      className: "Advanced English",
      time: "Today, 14:00",
      type: "class",
    },
    {
      id: 2,
      title: "Japanese Grammar Quiz",
      className: "Intermediate Japanese",
      time: "Tomorrow, 10:00",
      type: "exam",
    },
    {
      id: 3,
      title: "Essay Submission",
      className: "Business English",
      time: "Thu, 15:00",
      type: "assignment",
    },
    {
      id: 4,
      title: "Korean Speaking Practice",
      className: "Beginners Korean",
      time: "Fri, 13:30",
      type: "class",
    },
  ];

  // Sample data for achievements
  const achievements = [
    {
      id: 1,
      title: "Perfect Attendance",
      description: "Attended all classes for a month",
      icon: <CelebrationRounded />,
      color: "success",
      date: "Last week",
    },
    {
      id: 2,
      title: "Vocabulary Master",
      description: "Learned 500+ words in Japanese",
      icon: <EmojiEventsRounded />,
      color: "warning",
    },
    {
      id: 3,
      title: "Quick Learner",
      description: "Completed 10 lessons ahead of schedule",
      icon: <TrendingUpRounded />,
      color: "primary",
    },
  ];

  // Sample statistics
  const statistics = {
    enrolledCourses: 4,
    completedAssignments: 23,
    upcomingExams: 2,
    averageScore: "85%",
  };

  // Combine assignments and exams for the assignments list
  const allAssignments = [
    ...(assignmentsData?.data || []).map((item: any) => ({
      ...item,
      type: "task",
      className: "English Masterclass",
      status: Math.random() > 0.5 ? "completed" : "pending",
    })),
    ...(examsData?.data || []).map((item: any) => ({
      ...item,
      type: "exam",
      className: "Japanese Fundamentals",
      dueDate: item.examDate,
      status: Math.random() > 0.5 ? "completed" : "pending",
    })),
  ]
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  if (
    isLoadingClasses ||
    isLoadingMyClasses ||
    isLoadingAssignments ||
    isLoadingExams
  ) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3, px: { xs: 2, md: 4 }, maxWidth: "1300px", mx: "auto" }}>
      {/* Welcome Header */}
      <CardWelcome />

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title={t("participant.enrolledCourses")}
            value={statistics.enrolledCourses}
            icon={<SchoolRounded />}
            color="primary"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title={t("participant.completedAssignments")}
            value={statistics.completedAssignments}
            icon={<AssignmentRounded />}
            color="success"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title={t("participant.upcomingExams")}
            value={statistics.upcomingExams}
            icon={<FactCheckRounded />}
            color="warning"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title={t("participant.averageScore")}
            value={statistics.averageScore}
            icon={<TrendingUpRounded />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Main Content Area */}
      <Grid container spacing={3}>
        {/* Left Column - Classes & Assignments */}
        <Grid xs={12} md={8}>
          {/* Classes Section */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                level="h4"
                component="h2"
                startDecorator={<ClassRounded />}
              >
                {t("participant.myClasses")}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Input
                  size="sm"
                  placeholder={t("participant.searchClasses")}
                  startDecorator={<SearchRounded />}
                  sx={{ width: { xs: 120, sm: 200 } }}
                />
                <Button
                  size="sm"
                  variant="plain"
                  component={Link}
                  href="/classes"
                  endDecorator={<KeyboardArrowRightRounded />}
                >
                  {t("participant.viewAll")}
                </Button>
              </Box>
            </Box>

            <Tabs
              value={activeTab}
              //   onChange={(event, value) => setActiveTab(value as string)}
              sx={{ mb: 2 }}
            >
              {/* <TabList
                sx={{
                  pt: 0,
                  [`& .${tabClasses.root}`]: {
                    fontWeight: "600",
                    flex: "initial",
                    color: "text.tertiary",
                    [`&.${tabClasses.selected}`]: {
                      bgcolor: "transparent",
                      color: "text.primary",
                    },
                  },
                }}
              >
                <Tab value="all">{t("participant.allClasses")}</Tab>
                <Tab value="enrolled">{t("participant.enrolled")}</Tab>
                <Tab value="completed">{t("participant.completed")}</Tab>
              </TabList> */}
              {/* <TabPanel value="all" sx={{ p: 0 }}>
                <Grid container spacing={2}>
                  {(classesData?.data || []).slice(0, 3).map((course: any) => (
                    <Grid key={course.id} xs={12} sm={6} md={4}>
                      <ClassCard course={course} />
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
              <TabPanel value="enrolled" sx={{ p: 0 }}>
                <Grid container spacing={2}>
                  {(myClassesData?.data || [])
                    .slice(0, 3)
                    .map((course: any) => (
                      <Grid key={course.id} xs={12} sm={6} md={4}>
                        <ClassCard course={course} />
                      </Grid>
                    ))}
                </Grid>
              </TabPanel>
              <TabPanel value="completed" sx={{ p: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                  }}
                >
                  <Typography level="body-lg">
                    {t("participant.noCompletedClasses")}
                  </Typography>
                </Box>
              </TabPanel> */}
            </Tabs>
          </Box>

          {/* Assignments Section */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                level="h4"
                component="h2"
                startDecorator={<AssignmentRounded />}
              >
                {t("participant.assignments")}
              </Typography>
              <Button
                size="sm"
                variant="plain"
                component={Link}
                href="/assignments"
                endDecorator={<KeyboardArrowRightRounded />}
              >
                {t("participant.viewAll")}
              </Button>
            </Box>

            <Sheet variant="outlined" sx={{ borderRadius: "md" }}>
              <Box sx={{ p: 2 }}>
                <Typography level="title-md">
                  {t("participant.upcomingAssignments")}
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{ color: "text.tertiary", mb: 1 }}
                >
                  {t("participant.dueInNext7Days")}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ p: 2 }}>
                {allAssignments.length > 0 ? (
                  allAssignments.map((item) => (
                    <AssignmentCard
                      key={`${item.type}-${item.id}`}
                      item={item}
                    />
                  ))
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <Typography level="body-md">
                      {t("participant.noUpcomingAssignments")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Sheet>
          </Box>
        </Grid>

        {/* Right Column - Schedule, Blog, Achievements */}
        <Grid xs={12} md={4}>
          {/* Schedule Section */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                level="title-md"
                startDecorator={<CalendarMonthRounded />}
              >
                {t("participant.upcomingSchedule")}
              </Typography>
              <Button
                size="sm"
                variant="plain"
                component={Link}
                href="/calendar"
                endDecorator={<KeyboardArrowRightRounded />}
              >
                {t("participant.calendar")}
              </Button>
            </Box>
            <Divider />
            <List size="sm" sx={{ py: 0 }}>
              {scheduleEvents.map((event) => (
                <ScheduleItem key={event.id} event={event} />
              ))}
            </List>
          </Card>

          {/* News/Blog Section */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography level="title-md" startDecorator={<ArticleRounded />}>
                {t("participant.latestNews")}
              </Typography>
              <Button
                size="sm"
                variant="plain"
                endDecorator={<KeyboardArrowRightRounded />}
              >
                {t("participant.viewAll")}
              </Button>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </Box>
          </Card>

          {/* Achievements Section */}
          <Card variant="outlined">
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                level="title-md"
                startDecorator={<EmojiEventsRounded />}
              >
                {t("participant.achievements")}
              </Typography>
              <Tooltip title={t("participant.allAchievements")}>
                <IconButton size="sm" variant="plain">
                  <KeyboardArrowRightRounded />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
              <Button
                fullWidth
                variant="soft"
                color="primary"
                startDecorator={<TipsAndUpdatesRounded />}
                sx={{ mt: 1 }}
              >
                {t("participant.completeMoreAchievements")}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
