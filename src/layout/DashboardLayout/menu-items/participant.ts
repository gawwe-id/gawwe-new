// assets
import {
  AssignmentRounded,
  DashboardRounded,
  GroupRounded,
  SvgIconComponent,
} from "@mui/icons-material"

const icon: Record<string, SvgIconComponent> = {
  dashboard: DashboardRounded,
  class: AssignmentRounded,
  account: GroupRounded,
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
    icon: icon.dashboard,
    url: "/dashboard",
    children: null,
  },
  {
    id: "class",
    title: "Kelas",
    icon: icon.class,
    url: "",
    children: [
      {
        id: "class",
        title: "Semua Kelas",
        url: "/class",
      },
      {
        id: "schedule",
        title: "Jadwal",
        url: "/schedule",
      },
    ],
  },
  {
    id: "account",
    title: "Akun",
    icon: icon.account,
    url: "",
    children: [
      {
        id: "profile",
        title: "Profile",
        url: "/profile",
      },
    ],
  },
]
