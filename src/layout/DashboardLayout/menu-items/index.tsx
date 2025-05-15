// assets
import {
  HistoryEduRounded,
  DashboardRounded,
  GroupRounded,
  SvgIconComponent,
  AssignmentRounded,
  CalendarMonthRounded,
  NotificationsActiveRounded,
  PaymentRounded,
  ManageAccountsRounded,
  ReceiptLongRounded,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const icon: Record<string, SvgIconComponent> = {
  dashboard: DashboardRounded,
  class: HistoryEduRounded,
  account: GroupRounded,
  assignments: AssignmentRounded,
  calendar: CalendarMonthRounded,
  notifications: NotificationsActiveRounded,
  payments: PaymentRounded,
  accounts: ManageAccountsRounded,
  transactions: ReceiptLongRounded,
  students: GroupRounded,
};

export type Menu = {
  id: string;
  title: string;
  url: string;
  icon?: SvgIconComponent;
  children?: Menu[] | null;
};

export const useMenus = () => {
  const { t } = useTranslation();

  const participant: Menu[] = [
    {
      id: "dashboard",
      title: t("dashboard"),
      icon: icon?.dashboard!,
      url: "/dashboard",
      children: null,
    },
    {
      id: "classes",
      title: t("classes"),
      icon: icon.class!,
      url: "",
      children: [
        {
          id: "my_classes",
          title: t("myClasses"),
          url: "/my-classes",
        },
        {
          id: "all_classes",
          title: t("allClasses"),
          url: "/classes",
        },
      ],
    },
    {
      id: "assignments",
      title: t("assignments"),
      icon: icon.assignments!,
      url: "",
      children: [
        {
          id: "assignments",
          title: t("homework"),
          url: "/assignments",
        },
        {
          id: "exams",
          title: t("exams"),
          url: "/exams",
        },
        {
          id: "grades",
          title: t("grades"),
          url: "/grades",
        },
      ],
    },
    {
      id: "calendar",
      title: t("calendar"),
      icon: icon.calendar!,
      url: "/calendar",
    },
    {
      id: "notifications",
      title: t("notifications"),
      icon: icon.notifications!,
      url: "/notifications",
    },
    {
      id: "payments",
      title: t("payments"),
      icon: icon.payments!,
      url: "/payments",
    },
  ];

  const agency: Menu[] = [
    {
      id: "dashboard",
      title: t("dashboard"),
      icon: icon?.dashboard!,
      url: "/dashboard",
      children: null,
    },
    {
      id: "class_management",
      title: t("classManagement"),
      icon: icon.class!,
      url: "",
      children: [
        {
          id: "class_setting",
          title: t("classSettings"),
          url: "/class-setting",
        },
        {
          id: "batch",
          title: t("batchManagement"),
          url: "/batch",
        },
        {
          id: "enrollments",
          title: t("enrollmentStatus"),
          url: "/enrollments",
        },
      ],
    },
    {
      id: "assignments",
      title: "Assignments",
      icon: icon.assignments!,
      url: "/assignments?activetab=0",
    },
    {
      id: "calendar",
      title: t("calendarEvents"),
      icon: icon.calendar!,
      url: "/calendar",
    },
    {
      id: "students",
      title: t("studentManagement"),
      icon: icon.students!,
      url: "/students",
    },
    {
      id: "notifications",
      title: t("notifications"),
      icon: icon.notifications!,
      url: "/notifications",
    },
    {
      id: "transactions",
      title: t("transactions"),
      icon: icon.transactions!,
      url: "/transactions",
    },
  ];

  const participant_bottom: Menu[] = [
    {
      id: "accounts",
      title: t("accountSettings"),
      icon: icon.accounts!,
      url: "/account?activetab=0",
    },
  ];

  const agency_bottom: Menu[] = [
    {
      id: "accounts",
      title: t("accountSettings"),
      icon: icon.accounts!,
      url: "/account?activetab=0",
    },
  ];

  return {
    participant,
    agency,
    participant_bottom,
    agency_bottom,
  };
};
