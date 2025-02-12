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
  ManageAccountsRounded
} from "@mui/icons-material"


const icon: Record<string, SvgIconComponent> = {
  dashboard: DashboardRounded,
  class: HistoryEduRounded,
  account: GroupRounded,
  assignments: AssignmentRounded,
  calendar: CalendarMonthRounded,
  notifications: NotificationsActiveRounded,
  payments: PaymentRounded,
  accounts: ManageAccountsRounded
}

type Submenu = {
  id: string
  title: string
  url: string
}

export type Menu = {
  id: string
  title: string
  url: string
  icon: SvgIconComponent
  children?: Submenu[] | null
}


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
    ]
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
  }
]

export const participant_bottom: Menu[] = [
  {
    id: "accounts",
    title: "Account Setting",
    icon: icon.accounts!,
    url: "/accounts",
  },
]