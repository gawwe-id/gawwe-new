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

export const participant: Menu[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: icon?.dashboard!,
    url: "/dashboard",
    children: null,
  },
  {
    id: "my_classes",
    title: "My Classes",
    icon: icon.class!,
    url: "",
    children: [
      {
        id: "classes",
        title: "Semua Kelas",
        url: "/classes",
      },
      {
        id: "schedule",
        title: "Jadwal",
        url: "/schedule",
      },
    ],
  },
  {
    id: "assignments",
    title: "Assignments",
    icon: icon.assignments!,
    url: "",
    children: [
      {
        id: "assignments",
        title: "Tugas & Essay",
        url: "/assignments",
      },
      {
        id: "exams",
        title: "Ujian",
        url: "/exams",
      },
      {
        id: "grades",
        title: "Nilai & Catatan",
        url: "/grades",
      },
    ],
  },
  {
    id: "calendar",
    title: "Calendar",
    icon: icon.calendar!,
    url: "/calendar",
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: icon.notifications!,
    url: "/notifications",
  },
  {
    id: "payments",
    title: "Payments",
    icon: icon.payments!,
    url: "/payments",
  },
];

export const agency: Menu[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: icon?.dashboard!,
    url: "/dashboard",
    children: null,
  },
  {
    id: "class_management",
    title: "Class Management",
    icon: icon.class!,
    url: "",
    children: [
      {
        id: "class_setting",
        title: "Pengaturan Kelas",
        url: "/class-setting",
      },
      {
        id: "schedule",
        title: "Jadwal Kelas",
        url: "/schedule",
      },
      {
        id: "batch",
        title: "Kelola Batch",
        url: "/batch",
      },
      {
        id: "enrollments",
        title: "Enrollment Status",
        url: "/enrollments",
      },
    ],
  },
  {
    id: "assignments",
    title: "Assignments",
    icon: icon.assignments!,
    url: "",
    children: [
      {
        id: "assignments",
        title: "Kelola Tugas",
        url: "/assignments",
      },
      {
        id: "exams",
        title: "Kelola Ujian",
        url: "/exams",
      },
      {
        id: "quizzes",
        title: "Manajemen Quis",
        url: "/quizzes",
      },
      {
        id: "grades",
        title: "Manajemen Nilai",
        url: "/grades",
      },
    ],
  },
  {
    id: "calendar",
    title: "Calendar & Events",
    icon: icon.calendar!,
    url: "/calendar",
  },
  {
    id: "students",
    title: "Student Management",
    icon: icon.students!,
    url: "/students",
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: icon.notifications!,
    url: "/notifications",
  },
  {
    id: "transactions",
    title: "Transactions",
    icon: icon.transactions!,
    url: "/transactions",
  },
];

export const participant_bottom: Menu[] = [
  {
    id: "accounts",
    title: "Account Setting",
    icon: icon.accounts!,
    url: "/account?activetab=0",
  },
];

export const agency_bottom: Menu[] = [
  {
    id: "accounts",
    title: "Account Setting",
    icon: icon.accounts!,
    url: "/account?activetab=0",
  },
];
